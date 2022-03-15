const axios = require("axios");
const dayjs = require("dayjs");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const courses = [
  //{ id: 1320, ref: "sunbrook" },
  //{ id: 1322, ref: "dixie red hills" },
  //{ id: 1321, ref: "southgate" },
  //{ id: 1323, ref: "st george" },
  { id: 4154, ref: "crgc" },
  //{ id: 2791, ref: "ledges" },

];

const getData = async () => {
    console.log('get data running.............')
  const promises = [];

  const start = new Date("03/16/2022");
  const end = new Date("04/12/2022");

  courses.forEach((course) => {
    //loop through times
    let loop = new Date(start);
    while (loop <= end) {
      //console.log(loop);
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);

      const formatedDate = dayjs(loop).format("MM-DD-YYYY");
      // console.log(formatedDate);
      promises.push(
        axios.get(
          `https://foreupsoftware.com/index.php/api/booking/times?time=all&date=${formatedDate}&holes=all&players=0&booking_class=4627&schedule_id=${course.id}&schedule_ids%5B%5D=0&schedule_ids%5B%5D=${course.id}&specials_only=0&api_key=no_limits`
        )
      );
    }
  });

  Promise.all(promises).then((values) => {
    //  console.log(values);

    const mappedDt = values.map((value) => value.data);
    const allData =mappedDt.reduce((previous, current)=>{
        
        current.forEach(item=> item.uuid = uuidv4())
        previous.push(...current);
        return previous;
    }, [])
   // console.log(allData);
    fs.writeFile("teeTimes.json", JSON.stringify(allData), "utf-8", function(){
        console.log('done')
    })
  });

  //const res = await

  //console.log(res.data);
};
getData();
//export default getData;