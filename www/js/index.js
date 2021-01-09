var arregloPines = [];
var db = openDatabase("maps","1.0","Example", 2 * 1024 * 1024);

function cargarMapa(){

    var myOptions = {
        zoom:15,
        center: new google.maps.LatLng(-0.168785,-78.470889),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };  
    map = new google.maps.Map(document.getElementById('map'), myOptions)

    //LISTENER CLICK
    map.addListener('click', function(event){
        //console.log(event);
        agregarMarcador(event.latLng);
    });

    var pin = new google.maps.Marker({
        position: new google.maps.LatLng(-0.168785,-78.470889),
        map: map,
        title:"UDLA Queri"
    });

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS T_MAP ( id INTEGER PRIMARY KEY, long TEXT, lat TEXT)" );
    });
    table();

    arregloPines.push(pin);
}
//Mostrar Tabla de cordenadas
function table() {
    var table = document.getElementById('tbody');
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM T_MAP', [], function (tx, resultado) {
          var rows = resultado.rows;
          var tr = '';
          for(var i = 0; i < rows.length; i++){
                  tr += '<tr>';
                  tr += '<td>'+ rows[i].id +'</td>';
                  tr += '<td>' + rows[i].lat + '</td>';
                  tr += '<td>' + rows[i].long + '</td>';
                  tr += '</tr>';                   
          }
              table.innerHTML = tr; 
  
      }, null);
    });
  }
//Agregando Pines
function agregarMarcador(location){
    var pin = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.Drop
    });
    console.log("Latitud: ", location.lat());
    console.log("Longitud: ", location.lng());
    var latDb=location.lat();
    var longDb=location.lng();
    db.transaction(function(tx){
        tx.executeSql('INSERT INTO T_Map (long,lat) VALUES (?, ?)', [longDb,latDb]);
    });

    table();
    for(var i in arregloPines){
        arregloPines[i].setMap(null);
    }

    arregloPines.push(pin);
}