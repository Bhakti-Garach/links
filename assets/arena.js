// Use botton
// Use modal
// Use filter

// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = "multidisciplinary-design-bridging-disciplines-shaping-ideas"; // The “slug” is just the end of the URL

// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	// let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	// channelCount.innerHTML = data.length
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
				    <p><em>Link</em></p>
				    <picture>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
					<img src="${ block.image.original.url }">
				    </picture>
				    
			
				    <p><a href="${ block.source.url }">See the original ↗</a></p>
                </button>
                <dialog>
					<div>
						<p>${block.title}</p>
						<p>${block.description_html}</p>
					</div>
					<button class="close">×</button>
				</dialog>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
        let imageItem = `
        <li class="image-block">
            <button>
                <figure>
                    <image src="${block.image.large.url}">
                    <figcaption>${block.title}</figcaption>
                </figure>
            </button>
            <dialog>
                <div>
                    <p>${block.title}</p>
                    <p>${block.description_html}</p>
                </div>
                <img src="${block.image.large.url}">
                <button class="close">×</button>
            </dialog>
        </li>
    `
    channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (block.class == 'Text') {
		// …up to you!
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li>
					<p><em>Video</em></p>
					<video controls src="${ block.attachment.url }">
                    </video>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li>
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }"></audio>
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
				<li>
					<p><em>Linked Video</em></p>
					${ block.embed.html }
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
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
	let blocks = document.querySelectorAll('.image-block, .link-block')
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

		// Also display the owner and collaborators:
		let channelUsers = document.querySelector('#channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
	})

    initInteraction()

// Title Stretch on Scroll
window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;
    let maxShrink = 30;
    let newHeight = Math.max(90 - (scrollY / 10), 50);

    document.documentElement.style.setProperty('--svg-height', `${newHeight}vh`);
});


// Remove
// document.querySelector('#channel-count').remove();


// Mobile Menu Toggle
let menuToggle = document.querySelector('#menu-toggle');
let navLinks = document.querySelector('#nav-links');

menuToggle.onclick = () => { 
    navLinks.classList.toggle('active'); 
    menuToggle.textContent = navLinks.classList.contains('active') ? '[CLOSE]' : '[MENU]'; 
};

