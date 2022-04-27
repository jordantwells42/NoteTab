const addImage = document.getElementById("addImage")
const urlContainer = document.getElementById('urlContainer')


let urls = localStorage.getItem("urls")
let installed = false

if (localStorage.getItem("installed-pop")){
	installed = true
}

addImage.addEventListener("keyup", function(event){
    console.log(event)
    if (event.key == "Enter"){
		let img_src = addImage.value
		addImage.value = ""
		

		addUrl(img_src)
    }
})


function addUrl(img_src){
	urlContainer.innerHTML += `<div class = "container"><a href = ${img_src} class = "imageurl" target="_blank"><img src = ${img_src}></img></a><p class = "delete">x</p></div>`
	let delBtns = document.querySelectorAll(".delete")
    delBtns.forEach(delBtn => {
        delBtn.addEventListener("click", deleteUrl)
    
    })
    storeUrls()
}




function sendUrls(){
	chrome.runtime.sendMessage({greeting: "urls", urls: getUrls()}, function(response) {
          console.log(response.farewell);
    });   
}


function deleteUrl(event){
	console.log(event)
	url = event.path[1]
	url.remove()
	storeUrls()
}


function grabCurrentUrls(){
	let urls = []
	for (let childNode of urlContainer.childNodes){
		console.log(childNode)
		let urlp = childNode.childNodes[0]
		let url = urlp.href
		urls.push(url)
	}

	return urls
}

function storeUrls(){
	localStorage.setItem("urls", JSON.stringify(grabCurrentUrls()))
	sendUrls()
}

function getUrls(){
	let urls = JSON.parse(localStorage.getItem("urls"))
	console.log(urls)
	return urls
}

function restoreUrls(){
	for (let childNode of urlContainer.childNodes){
		childNode.delete()
	}	

	let urls = getUrls()
	for (let url of urls){
		addUrl(url)
	}
}


document.addEventListener("DOMContentLoaded", () =>{

	if (!installed){

		let images = ["https://wallpaperaccess.com/full/628286.jpg",
        "https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
        "https://wallpaperaccess.com/full/1579893.jpg",
        "https://wallpapercave.com/wp/wp2771916.jpg",
        "https://wallpaperboat.com/wp-content/uploads/2020/06/03/42361/aesthetic-anime-04.jpg",
        "https://wallpapercave.com/wp/wp2771912.jpg",
        "https://cdn.wallpapersafari.com/42/43/dizw8f.jpg",
        "https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701318002.jpg",
        "https://wallpaperaccess.com/full/925523.jpg",
        ]


		localStorage.setItem("urls", JSON.stringify(images))
		localStorage.setItem("installed-pop", JSON.stringify(true))
		restoreUrls()
	}

	restoreUrls()
	sendUrls()

	
})
