import fetch from "node-fetch";
import express from "express";
// import bodyParser from "bodyParser";
const app = express()
const port = process.env.PORT || 3000

var obj = {
    Proposals: 0,
    proposalsId: [],
    expireTimeStamp: []
};


var lastjson;


async function getData() {
    const data = JSON.stringify({
        query: `
        {
          proposals 
            {
              id
              title
              end
            }`
    });


    const response = await fetch(
        'https://hub.snapshot.org/graphql?operationName=Proposals&query=query%20Proposals%20%7B%0A%20%20proposals%20(%0A%20%20%20%20first%3A%2010%2C%0A%20%20%20%20where%3A%20%7B%0A%20%20%20%20%20%20space_in%3A%20%5B%223.spaceshot.eth%22%5D%2C%0A%20%20%20%20%20%20state%3A%20%22open%22%0A%20%20%20%20%7D%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20end%0A%20%20%20%0A%20%20%7D%0A%7D', {
            method: 'post',
            body: data,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'User-Agent': 'Node',
            },
        }
    )

    // let lastTimestamp = response.data.proposals[4].end
    const json = await response.json();




    for (let index = 0; index < json.data.proposals.length; index++) {

        obj.proposalsId.push(
            json.data.proposals[index].id
        );

        obj.expireTimeStamp.push(
            json.data.proposals[index].end
        )
        obj.Proposals++;



    }
    lastjson = JSON.stringify(obj);


    console.log(lastjson);
    //document.getElementById("json").innerHTML = JSON.stringify(obj, null, 4);
}

getData()

// app.use(bodyParser.json())

// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {

    res.send(obj)

})

app.get('/:expire', (req, res) => {
        var Newobj = {
            NewProposals: 0,
            proposalsId: [],
            expireTimeStamp: []
        };

        for (let index = 0; index < obj.Proposals; index++) {

            if (req.params.expire < obj.expireTimeStamp[index]) {
                Newobj.expireTimeStamp.push(
                    obj.expireTimeStamp[index])
                Newobj.proposalsId.push(
                    obj.proposalsId[index]
                )
                Newobj.NewProposals++;
            }



        }
        res.send(JSON.stringify(Newobj));
        console.log(Newobj)

    }

);



app.listen(port, () => console.log(`Listening on port ${port}!`))