## Tensor, Paper, Scissors
Although rock, paper, scissors  may seem like a trivial game, it actually involves the hard computational problem of temporal pattern recognition. This problem is fundamental to the fields of machine learning, artificial intelligence, and data compression. In fact, it might even be essential to understanding how [human intelligence works](https://en.wikipedia.org/wiki/Hierarchical_temporal_memory).

#### DEMO: http://tensorpaper.herokuapp.com
#### VIDEO: https://www.youtube.com/watch?v=2JwwXxt7hLc&feature=youtu.be

![screenshot](https://i.gyazo.com/fb5d8691d3cf8fa720f9729818944f6e.png)


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
