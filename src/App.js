
import React,{useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';
import Geo from './geoLocate.js'


function App() {
  const [info, setInfo] = useState([
    {
      preview: {
        source: ""
      },
      url: "",
      wikipedia: "",
      wikipedia_extracts: {
        text: ""
      }
    },
    {
      preview: {
        source: ""
      },
      url: "",
      wikipedia: "",
      wikipedia_extracts: {
        text: ""
      }
    },
    {
      preview: {
        source: ""
      },
      url: "",
      wikipedia: "",
      wikipedia_extracts: {
        text: ""
      }
    }, 
    {
      preview: {
        source: ""
      },
      url: "",
      wikipedia: "",
      wikipedia_extracts: {
        text: ""
      }
    },
    {
      preview: {
        source: ""
      },
      url: "",
      wikipedia: "",
      wikipedia_extracts: {
        text: ""
      }
    } 
  ]);
  const [POI, setPOI] = useState([
    {
    properties: {
      name: "Nothing Found :("
      }
    },
    {
    properties: {
      name: "Nothing Found :("
      }
    },
    {
    properties: {
      name: "Nothing Found :("
    }
    },  
  ]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [date1, setDate1] = useState('');
  const [cityImg, setCityImg] = useState([]);
  const [weatherImg, setWeatherImg] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [weather, setWeather] = useState('');
  const [time, setTime] = useState('');
  const [mapURL, setMapURL] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    async function fetchData(){
      getTime();
      getWeather();
      getCityImg();
      getPOI();
      // getAirport();

    }
      fetchData();
  }, [query]);

  const updateSearch = e => {
    setSearch(e.target.value);
  };
  

  const getTime = async () => {
    const response = await fetch(`https://api.ipgeolocation.io/timezone?apiKey=eb76857050e94c818c6fb98609402fac&location=${query}`);
    const data = await response.json();
    console.log(data);
    var time = ''
    if(!data.error){
      for(var i=0; i<12; i++){
        if(0<=i && i<5){
          if(i===0){
            if(data.time_12.charAt(i) != 0){
              time += data.time_12.charAt(i);
            }
          } else {
            time += data.time_12.charAt(i);
          }

        }
        if(i>=9){
          if(i==9){
            time= time + " "
          }
          time += data.time_12.charAt(i);
        }
      }
      console.log(time);
      setTime(time);
      var dateString = ""
      for(var i = 5; i<data.date.length; i++){
        if(data.date.charAt(i) != "-"){
          dateString += data.date.charAt(i);
        } else {
          dateString += "/"
        }
      }
      setDate1(dateString);
      dateString += "/"
      for(var i = 0; i<4; i++){
        dateString += data.date.charAt(i);
      }
      console.log(dateString);
      setDate(dateString);

   } else {
     setTime('N/A');
     console.log('error');
     setCode('1');
   }
  };

  const getWeather = async () => {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=4ba4ec413d424059946203123201010&q=${query}`);
    const data = await response.json();
    console.log(data);
    if(query.length>0 && !data.error){
      setWeather(data.current.temp_f);
      setWeatherCondition(data.current.condition.text);
      setWeatherImg(data.current.condition.icon);
      console.log(data.location.lon);
    } else {
      setWeather('N/A');
      setWeatherImg('N/A');
    }
  };

  
  const getPOI = async () => {
    const response1 = await fetch(`https://api.weatherapi.com/v1/current.json?key=4ba4ec413d424059946203123201010&q=${query}`);
    const data1 = await response1.json();
    console.log(data1);
    var array = [];
    if(query.length > 0 && !data1.error){
      setCode('');
      const response = await fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${data1.location.lon}&lat=${data1.location.lat}&rate=3&apikey=5ae2e3f221c38a28845f05b6a1a7a6b94cee08ab5ceba4ec1f5dd9c4`);
      const data = await response.json();
      console.log(data);
      var array2= [];
      for(var i=0; i<data.features.length; i++){
        if(data.features[i].properties.name==="" || data.features[i].properties.name.length > 19){
          i++;
        } else {
          array.push(data.features[i]);
          if(array.length>4){
            break;
          }
          i++
        }
      }
      console.log(array);
      if(array.length > 3){
        for(var i = 0; i<3; i++){
          var tempId = array[i].properties.xid
          const response1 = await fetch(`https://api.opentripmap.com/0.1/en/places/xid/${tempId}?apikey=5ae2e3f221c38a28845f05b6a1a7a6b94cee08ab5ceba4ec1f5dd9c4
          `);
          const data1 = await response1.json();
          array2.push(data1);
        }
      }
      console.log(code);

      if (array.length >= 5){
        setPOI(array);
        setCode('2');
        console.log(POI);
      } else {
        setCode('1');
        setPOI([
          {
          properties: {
            name: "Nothing Found :("
            }
          },
          {
          properties: {
            name: "Nothing Found :("
            }
          },
          {
          properties: {
            name: "Nothing Found :("
          }
          },  
        ])
      }
      console.log(array2);
      if(array.length>3){
        setInfo(array2);
      }
      console.log(info);
    } else {
      if(query.length > 0){
        console.log('error');
        setCode('1');
      }
    }
    }

  const getCityImg = async () => {
    const response = await fetch(`https://pixabay.com/api/?key=16676143-90f68719c2f978612f309a5b0&q=${query}&image_type=photo`);
    const data = await response.json();
    console.log(data);
    var imgArray = [];
    if(query.length>0){
      if(data.hits.length > 6){
        for(var i = 0; i<6; i++){
          imgArray.push(data.hits[i].largeImageURL)
        }
        console.log(imgArray);
        setCityImg(imgArray);
    
      }
      else {
        setCityImg("error")
        console.log('error');
        setCode('1');
      }
      
    }
  }

  const getSearch = e => {
    e.preventDefault();
    var mapurl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDAkvz3x_zNBchWATQe2Fh81edPmH6Cyo4&q=" + search
    setMapURL(mapurl);
    setTitle(search);
    setQuery(search);

  };

  const removeQuery = e => {
    e.preventDefault();
    console.log(query);
    setCityImg([]);
    setQuery('');
    setCode('');
    console.log(query);
  }



    if(query != '' && code === '1' || cityImg === "error") {
      return (
        <div className="App">
  
        <div className="layer"></div>
  
          <div id="bgslider">
            <figure>  
                <img src="https://images.unsplash.com/photo-1518730518541-d0843268c287?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="Slider"></img>
                <img src="https://wallpapercave.com/wp/C5gsPJq.jpg" alt="Slider"></img>
                <img src="https://i.pinimg.com/originals/83/71/b8/8371b8cc0a223bf644d58949cffef8ee.jpg" alt="Slider"></img>
                <img src="https://media.timeout.com/images/105240189/image.jpg" alt="Slider"></img>
                <img src="https://images.unsplash.com/photo-1518730518541-d0843268c287?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="Slider"></img>
              
                
              
            </figure>
            {/* <img id="world" src="https://media0.giphy.com/media/XZTfDO6EuHYnntDBVB/source.gif" alt=""/> */}
            {/* <img id="world" src="https://media1.giphy.com/media/LoTu84Yc0WyC6AbTwW/giphy.gif" alt=""/> */}
            <div className="content">
              <h1 id="first-question">Where to next? </h1>
              <form action="" onSubmit={getSearch}>
                <input id="first-input" type="text" placeholder="Ex: London, United Kingdom" value={search} onChange={updateSearch}/>
              </form>
              <div className="error">
                <h1>That city is not accepted</h1>
              </div>
              
            </div>
            
            <div id="skyline"></div>
          </div>
        </div>
       );
    }
   
    if(code === '2' && cityImg != "error"){
    return(

      <div className="App-2">
        <div className="header">
          <img src={cityImg[0]} alt="" className="mainImg"/>
          <div className="title-block">
            <div className="mainTitle">
              <h1>{title}</h1>
            </div>
            <div className="searchAgain">
              <form action="" onSubmit={removeQuery}>
                <button>Search Again</button>
              </form>
            </div>
          </div>
          
        </div>
        <div className="allContent">
        <div className="container">
          <div class="row justify-content-between mainContent">
           <div className="time col-md-4 col-sm-12 col-xs-12">
              <h2>Time </h2>
              <p>{time}</p>
           </div>
           <div className="weather col-md-4 col-sm-12 col-xs-12">
             <h2>Weather </h2>
             <p>{weather}&deg;F</p>
             <p><img src={weatherImg}></img></p>
           </div>
           <div className="basic-info col-md-4 col-sm-12 col-xs-12">
             <h2>Date </h2>
             <p id="date">{date}</p>
             <p id="date1">{date1}</p>
           </div>
         </div>
         
         <div className="geoText" >
           <div className="row">
            <Fade>
            <div className="col-md-6" >
              <h1>Location</h1>
              <p>The geographical location of {title} on a map.</p>
            </div>
            </Fade>
            <Fade>
            <div className="col-md-6">
                <iframe
                  width="100%"
                  height="500"
                  frameborder="0"
                  src={mapURL} allowfullscreen>
                </iframe>
            </div>
            </Fade>
           </div>
         </div>
         
        </div>
        </div>
        
        <div className="spacer"></div>

        <div className="spacer2">
          <img src={cityImg[1]} alt=""/>
        </div>

        <div className="poi-block">
          <div className="container">
            <Fade>
            <div className="poi-title">
              <h1>Points of Interest</h1>
              <p>Places to see in {title}</p>
            </div>
            </Fade>
            <div className="row">
              <Fade>
              <div className="col-md-4">
                <div className="poi">
                  <div className="poi-img">
                    <img src={info[0].preview.source} alt=""/>
                  </div>
                  <div className="poi-name">
                  <a href={info[0].wikipedia} target="_blank"><h3>{POI[0].properties.name}</h3></a>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="poi">
                  <div className="poi-img">
                    <img src={info[1].preview.source} alt=""/>
                  </div>
                  <div className="poi-name">
                    <a href={info[1].wikipedia} target="_blank"><h3>{POI[1].properties.name}</h3></a>
                  </div>
                </div>
              </div>
              </Fade>
              <Fade>
              <div className="col-md-4">
                <div className="poi last-poi">
                  <div className="poi-img">
                    <img src={info[2].preview.source} alt=""/>
                  </div>
                  <div className="poi-name">
                  <a href={info[2].wikipedia} target="_blank"><h3>{POI[2].properties.name}</h3></a>
                </div>
              </div>
              </div>
              </Fade>
            </div>
          </div>
        </div>
        
        <div className="gallery">
          <div className="container">
            <Fade>
            <div className="row">
              <div className="col-md-6 gallery-images">
                <div className="col-md-6 gallery-text-2" >
                  <h1>Gallery</h1>
                  <p>Quality images from {title}</p>
                </div>
                <div className="row">
                  <div className="col-md-6 image1">
                    <img src={cityImg[2]} alt=""/>
                  </div>
                  <div className="col-md-6">
                    <img src={cityImg[3]} alt=""/>
                  </div>
                </div>
                <div className="row row-img-2">
                  <div className="col-md-6 image1">
                    <img src={cityImg[4]} alt=""/>
                  </div>
                  <div className="col-md-6">
                    <img src={cityImg[5]} alt=""/>
                  </div>
                </div>
              </div>
              <div className="col-md-6 gallery-text" >
                <h1>Gallery</h1>
                <p>Quality images from {title}</p>
              </div>
            </div>
            </Fade>
          </div>
        </div>
        
      </div>
      

    );
    }

    return (
      <div className="App">

      <div className="layer"></div>

        <div id="bgslider">
          <figure>  
              <img src="https://images.unsplash.com/photo-1518730518541-d0843268c287?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="Slider"></img>
              <img src="https://wallpapercave.com/wp/C5gsPJq.jpg" alt="Slider"></img>
              <img src="https://i.pinimg.com/originals/83/71/b8/8371b8cc0a223bf644d58949cffef8ee.jpg" alt="Slider"></img>
              <img src="https://media.timeout.com/images/105240189/image.jpg" alt="Slider"></img>
              <img src="https://images.unsplash.com/photo-1518730518541-d0843268c287?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="Slider"></img>
            
              
            
          </figure>
          {/* <img id="world" src="https://media0.giphy.com/media/XZTfDO6EuHYnntDBVB/source.gif" alt=""/> */}
          {/* <img id="world" src="https://media1.giphy.com/media/LoTu84Yc0WyC6AbTwW/giphy.gif" alt=""/> */}
          <div className="content">
            <h1 id="first-question">Where to next? </h1>
            <form action="" onSubmit={getSearch}>
              <input id="first-input" type="text" placeholder="Ex: London, United Kingdom" value={search} onChange={updateSearch}/>
            </form>

          </div>
          
          <div id="circle1"></div>
          <div id="skyline"></div>
        </div>
      </div>
     );
    
    
}

export default App;
