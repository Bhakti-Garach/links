// ARENA API
// BOX MODAL
// FILTER


// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = "multidisciplinary-design-bridging-disciplines-shaping-ideas" // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<li class="link-block">
				<button>
					<img src="${ block.image.original.url }"></img>
				</button>
				<dialog>
					<div class="modal-content">
						<img src="${ block.image.original.url }"></img>
						<p>${ block.title }</p>
						<p>${ block.description_html }</p>
					</div>
					<p><a href="${ block.source.url }">See the original ↗</a></p>
					<button class="close">[CLOSE]</button>
				</dialog>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
		
		let imageItem =
			`
			<li class="image-block">
				<button>
					<figure>
						<img src="${ block.image.original.url }"></img>
					</figure>
				</button>
				<dialog class="modal-content">
					<div>
						<p>${ block.title }</p>
						<p>${ block.description_html }</p>
					</div>
					<img src="${ block.image.original.url }"></img>
					<button class="close">[CLOSE]</button>
				</dialog>
				
			</li>
			`		
		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (block.class == 'Text') {
		console.log(block)
		let textItem =
		`
		<li class="Text">
			<button>
				<blockquote>${block.content}</blockquote>
			</button>
			<dialog>
				<div class="modal-content">
					<blockquote>${ block.content }</blockquote>
				</div>
				<button class="close">[CLOSE]</button>
			</dialog>
		</li>
		`
		channelBlocks.insertAdjacentHTML('beforeend', textItem)
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		console.log(block)
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li class="video">
				<button>
					<video src="${ block.attachment.url }" autoplay muted playsinline loop></video>
				</button>
				<dialog>
					<div class="modal-content">
					<video src="${ block.attachment.url }" controls style="width: 100%; height: auto;"></video>
					<p>${ block.generated_title }</p>
					</div>
					<button class="close">[CLOSE]</button>
				</dialog>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video

			// Toggle controls on click
			let videoPlay = channelBlocks.querySelector('.video:last-child video');
			videoPlay.addEventListener('click', function() {

			if (this.hasAttribute('controls')) {
				this.removeAttribute('controls');
			} else {
				this.setAttribute('controls', 'controls');
			}
			});
		
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			console.log(block)
			let pdfItem =
			`
			<li class="pdf">
				<button>
				<a href="${block.attachment.url}">
					<figure>
						<img controls src="${block.image.large.url}" alt="${block.title}">
					</figure>
				</a>
				</button>
				<dialog>
					<div></div>
					<button class="close">[CLOSE]</button>
				</dialog>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			console.log('Rendering audio block:', block);
			let audioItem =
				`
				<li class="audio">
					<button>
						<div class="audio-content">
							<audio controls src="${ block.attachment.url }"></audio>

						</div>
					</button>
					<dialog>
						<div class="modal-content">
						<audio controls src="${ block.attachment.url }" style="width: 100%;"></audio>
						<p>${ block.generated_title }</p>
						</div>
						<button class="close">[CLOSE]</button>
					</dialog>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li class="linked-video">
				<button>
					${ block.embed.html }
				</button>
				<dialog>
                    <div class="modal-content">
                        ${ block.embed.html }
                    </div>
                    <button class="close">[CLOSE]</button>
                </dialog>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
			// Fixing height
			let iframes = document.querySelectorAll('.linked-video iframe');
			iframes.forEach(iframe => {
			  iframe.removeAttribute('height');
			  if(iframe.hasAttribute('allowfullscreen')){
                iframe.removeAttribute('allowfullscreen');
              }
			});
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
		}
	}
}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}

let initInteraction = () => {
	let blocks = document.querySelectorAll('.image-block, .link-block, .Text, .video, .pdf, .audio, .linked-video')
	blocks.forEach((block) => {
		let openButton = block.querySelector('button')
		let dialog = block.querySelector('dialog')
		let closeButton = dialog.querySelector('button')

		openButton.onclick = () => {
			dialog.showModal()
		}

		closeButton.onclick = () => {
			dialog.close()
		}

		dialog.onclick = (event) => { // Listen on our `modal` also…
			if (event.target == dialog) { // Only if clicks are to itself (the background).
		dialog.close() // Close it then too.
		}
	}

	})

}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		initInteraction()

		// Also display the owner and collaborators:
		let channelUsers = document.querySelector('#channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
	})



// FILTER


let filterBlocks = (filter) => {
    let blocks = document.querySelectorAll("#channel-blocks li");

    blocks.forEach((block) => {
        block.style.display = "none";


        if (filter === "all" || block.classList.contains(filter)) {
            block.style.display = "block";
        }
    });
}


let initFilters = () => {
    let filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {

            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            let filter = button.getAttribute("data-filter");
            filterBlocks(filter);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
});
