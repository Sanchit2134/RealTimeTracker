//initalize the socket
const socket = io();  //io function call karte hi backend mai ek request jati hai 

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-location', { latitude, longitude });
        }),
        (error) => {
            console.error(error);
        },
    {
        enableHighAccuracy: true, //high level ki accuracy chahiye
        timeout: 5000, //fer se check karo location kya hai
        maximumAge: 0 //cache off rakhne hai
    }
} 

//location do apne 
const map = L.map("map").setView([0, 0], 10 );  //view set karo aur uske baad pass karo latitude aur longitude 0,0 means center of the world and 16 is zoom level

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Sanchit's World"
}).addTo(map);  

const markers = {};   //jai line mark lagayege   

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id) => {
    map.removeLayer(markers[id]);
    delete markers[id];  //agar koi disconnect ho jata hai toh uska marker remove kar do
})          