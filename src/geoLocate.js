import React, { Component, useEffect, useState } from "react";
import { render } from "react-dom";

const Geo = () => {
    const [info, setInfo] = useState('')
    var hello = "hello";


    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setInfo(position.coords.latitude + ", " + position.coords.longitude)
    });



    return (
      <div>
        <h4>{info}</h4>
        <h1>Hello there</h1>
      </div>
    );
  
}

// render(<Geo/>, document.getElementById("root"));
export default Geo;