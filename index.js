var mainId = document.getElementById('main');
var searchBtn = document.getElementById('search-btn');
var searchBox = document.getElementById('search-box');
var favId = document.getElementById("fav-id");
const singleItem = document.getElementById('single-item');
let favBlock = document.getElementsByClassName('fav-class');
let favitemClass = document.getElementById('fav-items');
let cross = document.getElementById('cross');

let itemList =[];
let favs =[];
let favsItemDetail =[];
let searchItems =[];
fetchData();
//search box event listener
searchBox.addEventListener('keyup', (e) => {   
    console.log(searchItems)
    remove();
    for(var i of searchItems){
        if(i.toLowerCase().startsWith(searchBox.value.toLowerCase()) && searchBox.value != ""){
            let litem = document.createElement("li");
            litem.style.cursor = "pointer";
            litem.classList.add("list-item");
            litem.textContent = i;
            litem.setAttribute("onclick",() =>{
                searchBox.value = i;
            });
            document.querySelector(".list").appendChild(litem);
        }
        
    }
});
// remove items from search suggestions
function remove(){
    let ritems = document.querySelectorAll(".list-item");
    ritems.forEach((ritem)=>{
        ritem.remove();
    })
}
// handle click listner on the document where we can check at which position user has clicked and than perform an action
function handleClickListener(e){
    
    let searchItem = searchBox.value;
   
    if(e.target.id == 'search-btn'){ 
        searchBox.textContent="";
        searchByName(searchItem);
    }
    // if(e.target.className == 'item'){
    //         localStorage.setItem("id",e.target.id);
    //         window.location.href = '/item.html';
    //     }    
  
   
    if(e.target.className =='fa-solid fa-heart '){
       
        favs.push(e.target.id);
        searchByFavId(e.target.id);
        showData();
   
        alert("Add to favorite");
    }
    if(e.target.className == 'fa-solid fa-heart active'){
        
        favs = favs.filter(id => id != e.target.id );
        favsItemDetail = favsItemDetail.filter(item => item.idMeal != e.target.id);
        
        showData();
        showfavorites();
    }
    if(e.target.className=="detail-btn"){
        
        mainId.style.display = "none";
        singleItem.style.display="block";
        searchById(e.target.id)
    }
    if(e.target.className == 'fav-show'){
        
        favBlock[0].style.display = "block";
        showfavorites();
    }
    if(e.target.id == 'cross'){
        favBlock[0].style.display = "none";
    }
    
}

// search by id
function searchByFavId(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            // console.log(data);
            // itemList = data.meals;
            favsItemDetail.push(data.meals[0]);
            
            
        })
        .catch((e)=>{
            console.log(e);
        });
}
// search by id
function searchById(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            // console.log(data);
            // itemList = data.meals;
            favsItemDetail.push(data.meals[0]);
            
            showSingleItem(data.meals[0]);
        })
        .catch((e)=>{
            console.log(e);
        });
}
function showSingleItem(item){
    singleItem.innerHTML = '';
    
    const div = document.createElement('div');
    div.innerHTML = `
        <h1 id="name">${item.strMeal}</h1>
        <div  id="body-div">
            <img src ="${item.strMealThumb}" />
            <div id="insta">
                <h2>Instructions</h2>
                <p>${item.strInstructions}</p>
                <a href=${item.strYoutube} >Watch Video</a>
            </div>
        </div>                
    `;
    singleItem.append(div);
}
function initializeApp(){
    // addTaskInput.addEventListener('keyup',handleInputKeypress);
    document.addEventListener('click',handleClickListener);
}
initializeApp();
//search by name 
function searchByName(name){
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        .then((response)=>{
            
            return response.json();
        })
        .then((data)=>{

          
            itemList = data.meals;
            
            if(itemList!=null){
                showData();

            }
            
            
        })
        .catch((e)=>{
            console.log(e);
        });
}
// fetch data by category of items
function fetchData(){
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood')
        .then((response)=>{
            
            return response.json();
        })
        .then((data)=>{
        
            // searchByName();
            itemList = data.meals;
            showData();
        })
        .catch((e)=>{
            console.log(e);
        });

}
// show data in our body page
function showData(){
    mainId.innerHTML = '';
   
    for(var item of itemList){
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="item" id="${item.idMeal}">
                <img src ="${item.strMealThumb}" />
                <p>${item.strMeal}</p>
                <div class="item-btns">
                    <button class="detail-btn" id="${item.idMeal}" >More Details</button>
                    <i id="${item.idMeal}" class="fa-solid fa-heart ${isFav(item.idMeal) ? "active":""}"  ></i>
                </div>
                
            </div>       
        `;
        mainId.append(div);
    }
}
//show favrites items only
function showfavorites(){
    console.log("In the favorites")

    favitemClass.innerHTML = '';

    for(var item of favsItemDetail){
       
        let div = document.createElement('div');
       
        div.innerHTML = `
            <div class="fav-item">
            <img src ="${item.strMealThumb}" />
                <p>${item.strMeal}</p>
                <div class="fav-item-btns">
                    <button class="detail-btn" id="${item.idMeal}" >More Details</button>
                    <i  id="${item.idMeal}" class="fa-solid fa-heart ${isFav(item.idMeal) ? "active":""}"></i>
                </div>
            </div>

        `;
        favitemClass.append(div);

    }
   
    
}
function isFav(id){

    if(favs.includes(id)){
        console.log("In the true")
        return true;
    }
    return false;
}
function addRemoveToFavList(id){
   
    if(favs.includes(id)){
        return;
    }
    favs.push(id);
    showData();
}
