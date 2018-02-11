const mongoose = require('mongoose');
const User = mongoose.model('User');
const cote = require('cote');

const userResponder = new cote.Responder({
  name: 'user responder',
  namespace: 'user',
  respondsTo: ['create']
});

const userPublisher = new cote.Publisher({
  name: 'user publisher',
  namespace: 'user',
  broadcasts: ['update']
});

userResponder.on('*', console.log);

userResponder.on('create', async (req, res) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  const userResult = await register(user, req.body.password);
  updateUsers()
    .then(result => res.send(result));
});

userResponder.on('list', async(req, res) => {
  reviews = await User.find();
  res.json(reviews);
});

async function updateUsers() {
    users = await User.find();
    userPublisher.publish('update', users);
}
