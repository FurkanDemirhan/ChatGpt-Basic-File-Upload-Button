// Create the button
const button = document.createElement('button');
button.innerText = 'Submit File';
button.style.backgroundColor = 'green';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.margin = '5px';

// Create the progress element
const progress = document.createElement('progress');
progress.style.width = '99%';
progress.style.height = '5px';
progress.style.backgroundColor = 'grey';

// Create the progress bar inside the progress element
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append the button and progress elements to the DOM before the specified element
const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// Handle button click event
button.addEventListener('click', async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.js,.py,.html,.css,.json,.csv';

  // Handle file selection
  input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Read file as text
      reader.onload = async (event) => {
        const text = event.target.result;
        const chunkSize = 15000;
        const numChunks = Math.ceil(text.length / chunkSize);
        progressBar.style.width = '0%';

        for (let i = 0; i < numChunks; i++) {
          const start = i * chunkSize;
          const end = start + chunkSize;
          const chunk = text.substring(start, end);
          await submitConversation(chunk, i + 1, file.name);
          progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
        }

        progressBar.style.backgroundColor = 'blue';
      };

      reader.readAsText(file);
    }
  });

  // Trigger file input click event
  input.click();
});

// Function to submit a conversation part
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector('textarea[tabindex="0"]');
  const enterKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);

  // Check if ChatGPT is ready
  let chatgptReady = false;
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
  }
}
