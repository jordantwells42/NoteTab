let addNote = document.getElementById("addNote")
let board = document.getElementById("board")
let searchbar = document.getElementById('searchbar')


let colors = ["#C23B23","#F39A27","#EADA52","#03C03C","#579ABE","#976ED7"]
let idx = 0

let installed = false

if (localStorage.getItem("installed-note")){
	installed = true
}

let photos = ["https://wallpaperaccess.com/full/628286.jpg",
		"https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
		"https://wallpaperaccess.com/full/1579893.jpg",
		"https://wallpapercave.com/wp/wp2771916.jpg",
		"https://wallpaperboat.com/wp-content/uploads/2020/06/03/42361/aesthetic-anime-04.jpg",
		"https://wallpapercave.com/wp/wp2771912.jpg",
		"https://cdn.wallpapersafari.com/42/43/dizw8f.jpg",
		"https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701318002.jpg",
		"https://wallpaperaccess.com/full/925523.jpg",
		]
			

if (localStorage.getItem("photos")) {
	photos = JSON.parse(localStorage.getItem("photos"))
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");

	if (request.greeting == 'urls'){
	  photos = request.urls
	  localStorage.setItem("photos", JSON.stringify(photos))

	  updatePhotos()
	};
  }
);

function updatePhotos(){
	photos = JSON.parse(localStorage.getItem("photos"))
	return photos
}


function getBackgroundImage(){

	let photos = updatePhotos()
	photo = photos[Math.floor(Math.random() * photos.length)]
	document.body.background = photo
	return
		
}



document.addEventListener("DOMContentLoaded", function(event){


	if (!event | !event.target.location.origin.includes("chrome-extension://")){
		return
	}

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


		localStorage.setItem("photos", JSON.stringify(images))
		localStorage.setItem("installed-note", JSON.stringify(true))
		updatePhotos()
	}
	

	updatePhotos()
	getBackgroundImage()

	let noteValues = JSON.parse(localStorage.getItem("noteValues"))
	

	for (let [num, value] of Object.entries(noteValues)){
		if (value){
		board.innerHTML += '<div class ="noteContainer" id="note' + num + '"><textarea class = "note"></textarea><div class = "delete">x</div></div>'
		note = document.getElementById("note" + num).childNodes[0]
		
		note.value = value
		
		note.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

		if (parseInt(num) >= idx){
			idx = parseInt(num) + 1
			console.log(idx)
		}
		}

	}
	getBackgroundImage()
	updateNotes()
	restoreNotes()
})


searchbar.addEventListener("keyup", function(event){
	console.log(event)
	if (event.key == "Enter"){
		console.log(searchbar.value)
		chrome.runtime.sendMessage({greeting: "hello", search_query: searchbar.value}, function(response) {
		  console.log(response.farewell);
		});   
	}
})

addNote.addEventListener("click", function(event){
	console.log("clicked!")
	let num = idx
	board.innerHTML += '<div class ="noteContainer" id="note' + num + '"></div>'
	noteContainer = document.getElementById('note' + num)

	initEditor(noteContainer)    
	idx += 1
	restoreNotes()
	updateNotes()
});

function recalculateIndex(){
	let notes = document.querySelectorAll(".noteContainer")
	board.style.setProperty("--m", notes.length)
	board.style.setProperty("--tan", Math.tan(Math.PI/notes.length).toFixed(2))
	
	i = 1
	notes.forEach(note =>{
		note.style.setProperty("--i", i)
		i += 1
	})
}

// <button id="addNote" name = "addNote" class = "addNote-btns">New Note</button>

function initEditor(e) {
	e.innerHTML += '<textarea class = "note"></textarea>'
	e.innerHTML += '<div class = "delete">x</div>'
	e.childNodes[0].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
	e.style.zIndex = "0"
	updateNotes()

}



function storeNotes(){
	let values = {}
	let notes = document.querySelectorAll(".noteContainer")
	notes.forEach(note => {
		let id = note.id
		let num = id.slice(4)
		values[num] = note.childNodes[0].value
		

	})

	localStorage.setItem("noteValues", JSON.stringify(values))
}

function restoreNotes(){
	let values = JSON.parse(localStorage.getItem("noteValues"))
	let notes = document.querySelectorAll(".noteContainer")
	notes.forEach(note => {
		let id = note.id
		let num = id.slice(4)

		value = values[num]

		if (value){
			note.childNodes[0].value = value
		}
	})

}


function updateNotes(){
	updateListeners()
	recalculateIndex()
}


function updateListeners(){
	let notes = document.querySelectorAll(".noteContainer")
	notes.forEach(note => {
		note.addEventListener("mouseenter", placeNoteOnTop)
		note.addEventListener("mouseout", autoIndexNotes)
	
	})

	let textareas = document.querySelectorAll(".note")
	textareas.forEach(textarea => {
		textarea.addEventListener("change", storeNotes)
	})

	let deletes = document.querySelectorAll(".delete")
	deletes.forEach(del => {
		del.addEventListener("click", deleteNote)
	})
}

document.querySelectorAll( '.board' ).forEach( ( ciclegraph )=>{
  let circles = ciclegraph.querySelectorAll( '.noteContainer' )
  let angle = 360-90, dangle = 360 / circles.length
  for( let i = 0; i < circles.length; ++i ){
	let circle = circles[i]
	angle += dangle
	circle.style.transform = `rotate(${angle}deg) translate(${ciclegraph.clientWidth / 2}px) rotate(-${angle}deg)`
  }
})

function deleteNote(e){
	elem = e.target

	if (elem.className != "delete"){
		return
	}


	noteContainer = e.path[1]
	noteContainer.remove()
	updateNotes()
	storeNotes()
}


function placeNoteOnTop(e) {
	storeNotes()
	elem = e.target

	elem.style.zIndex = "100"



}

function autoIndexNotes(e){
	storeNotes()
	document.querySelectorAll(".noteContainer").forEach((note) => {
		note.style.zIndex = "auto"
	})
}



