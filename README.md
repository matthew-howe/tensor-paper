## DEMO: http://tensorpaper.herokuapp.com
## VIDEO: https://www.youtube.com/watch?v=2JwwXxt7hLc&feature=youtu.be

![screenshot](https://i.imgur.com/yKXPCXz.png)

Play against a simple AI in Rock Paper Scissors that progressively learns.
We are utilizing tensorflow.js, and outputting graphs in D3.js.

Utilizing a sequential model we identify the users next rock paper scissors 'throw'. Our AI knows you're going to throw rock next!

We are graphing loss in real time, as well as showing other machine learning metrics such as epochs,
and our raw output tensor probabilities(I.E -- Rock -- 43%, Paper -- 29%, Scissors 28%).

Our input and output tensors are One-hot-encoded in a PostgreSQL database, which is used by the front end
to continually output new tensor probabilities.

![tensors](https://github.com/matthew-howe/tensorpaperscissors/blob/037273acf5e587ab865a6eb9cb20cdd39b3b98ef/app/components/images/neurons.png)


### SETUP for cloning to run locally

• git clone https://github.com/thetensorgroup/tensorpaperscissors.git  
• createdb tensorps (Postgres database requires db named 'tensorps')  
• npm install  
• npm run start
