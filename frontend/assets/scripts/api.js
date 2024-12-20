document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start');
    // Ensure that submitData is available globally or appropriately exported/imported
    window.submitData = async () => {


        const sections = Array.from(document.querySelectorAll('section'));
        let currentSectionIndex = sections.findIndex(section => section.classList.contains('visible'));

        // Show Results section
        sections[currentSectionIndex].classList.remove('visible');
        currentSectionIndex++;
        if (currentSectionIndex < sections.length) {
            sections[currentSectionIndex].classList.add('visible'); // Show Results section
            console.log(`Showing section: ${sections[currentSectionIndex].id}`);
        } else {
            console.error('No Results section found.');
            return;
        }

        // Show loading message with spinner
        const destinationDiv = document.getElementById('destination');
        destinationDiv.innerHTML = `
            <div class="spinner"></div>
            <p>Loading your recommended destination...</p>
        `;
        console.log('Displayed loading spinner.');

        // Gather user inputs
        const preference1 = document.getElementById('preference1').value;
        const preference2 = document.getElementById('preference2').value;
        const preference3 = document.getElementById('preference3').value;
        const preference4 = document.getElementById('preference4').value;
        const preference5 = document.getElementById('preference5').value;
        const preference6 = document.getElementById('preference6').value;

        // Log gathered inputs for debugging
        console.log('User Preferences:', {
            preference1,
            preference2,
            preference3,
            preference4,
            preference5,
            preference6
        });

        const flipbook = document.getElementById('flipbook');
        flipbook.innerHTML += '<div class="hard"><div class="hard" id="Text1"></div></div>';
        for (let i = 1; i <= preference2; i++) {
            flipbook.innerHTML += `
            <div class="page" data-content=" "></div>
            <div class="page">
                <div id="map${i}" style="width: 100%; height: 100%;"></div>
            </div>`;
        }
        flipbook.innerHTML += '<div class="hard"><div class="hard"><h2>Enjoy Your Trip!</h2></div></div>';
        document.dispatchEvent(new CustomEvent('pagesLoaded', { detail: { totalMaps: preference2 } }));

        console.log(`Total Days: ${preference2}`);
        console.log(`Total Maps: ${preference2}`);


        // Construct the prompt
        const prompt = `
Based on the following trip preferences, suggest the most appropriate itinerary in Japan and provide a brief description.

Preferences:
1. Where are you visiting? ${preference1}
2. How long is your trip? ${preference2} days
3. How old are you? ${preference3}
4. How do you feel about unknown places and experiences? ${preference4}
5. What is the most important purpose of travel? ${preference5}
6. Indoors or Outdoors? ${preference6}

Response format:
Destination: <Name>
Description: DAY 1:
                        <br> 8:00 Place to visit; details
                        <br> 12:00 Place to visit; details...
             DAY 2: if there is day 2
             DAY 3: if there is day 3
             ...

Please respond in plain text without using any Markdown formatting. Don't put a line in between Destination and Description. Prioritize preference3.
`;

        console.log('Constructed Prompt:', prompt);

        try {
            const response2 = await fetch('http://localhost:3000/api/openai-config');
            const data2 = await response2.json();

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data2.apiKey,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini", // Ensure the model name is correct
                    messages: [
                        { role: "system", content: "You are an assistant that helps users plan their trips to Japan." },
                        { role: "user", content: prompt } // 'prompt' is your constructed prompt based on user inputs
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                })
            });

            const data = await response.json();
            console.log('API Response Data:', data);

            if (response.ok) {
                const text = data.choices[0].message.content.trim();
                console.log('Raw API Text:', text);

                // JavaScriptの変数を定義
                var destination = preference1;
                var textDiv = document.getElementById("Text1");
                textDiv.textContent = `Your ${destination} Trip`;

                // Display raw API response
                destinationDiv.innerHTML = null;
                const pages = text.split("DAY");
                console.log(pages[1]);
                console.log(pages[2]);
                console.log(pages[3]);
                console.log(pages[4]);
                console.log(pages[5]);
                console.log(pages[6]);
                // Split by "Day" and store in array
                $("#flipbook").show();
                $("#flipbook").turn({
                    width: 800,
                    height: 600,
                    autoCenter: true,
                    gradients: true,
                    acceleration: true
                });

                // Insert text into pages and add page numbers
                $("#flipbook .page").each(function (index) {
                    const content = $(this).data("content");
                    if (content) {
                        const dayIndex = Math.floor(index / 2);
                        console.log(dayIndex);
                        console.log(index);
                        console.log(pages.length);
                        console.log(pages[dayIndex + 1]);

                        if (dayIndex < pages.length) {
                            $(this).html(`<div><p>Day${pages[dayIndex+1]}</p></div><div class="page-number">${dayIndex + 1}</div>`);

                        }
                    }

                    // if (content) {
                    //     const [title] = content;
                    //     $(this).html(`<div><h2>${title}</h2><p> Day${pages[(index + 2) / 2]}</p></div><div class="page-number">${index + 1}</div>`);
                    // }

                    const pageNumber = $(this).find(".page-number");
                    if ((index) % 2 === 0) {
                        pageNumber.addClass("left-number");
                    } else {
                        pageNumber.addClass("right-number"); // Uncomment if needed
                    }
                });

                console.log('Displayed raw API response in Results section.');

                $("#download").show();
                document.getElementById('download').addEventListener('click', async () => {
                    try {
                        const doc = new jsPDF('landscape');  // 横向き（ランドスケープ）でPDFを作成
                        const totalPages = $("#flipbook").turn("pages");

                        for (let i = 1; i <= totalPages; i++) {
                            $("#flipbook").turn("page", i);

                            await new Promise(resolve => setTimeout(resolve, 500));  // ページが表示されるまで待機

                            // ページをキャプチャ
                            const canvas = await html2canvas($("#flipbook")[0]);
                            const imgData = canvas.toDataURL("image/png");

                            // 1ページ目はそのまま、2ページ目以降は新しいページを追加してから画像を追加
                            if (i > 1) doc.addPage('landscape');
                            doc.addImage(imgData, "PNG", 0, 0, 297, 210);  // 横向きのA4サイズ
                        }

                        doc.save('flipbook.pdf');
                    } catch (error) {
                        console.error('PDF生成エラー:', error);
                    }
                });

            } else {
                console.error('Error from OpenAI:', data);
                destinationDiv.innerHTML = `<p>Error: ${data.error.message}</p>`;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            destinationDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };
});