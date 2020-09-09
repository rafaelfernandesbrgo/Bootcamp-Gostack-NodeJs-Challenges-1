
//imports
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

//creates and sets
const app = express();
app.use(express.json());
app.use(cors());
const repositories = [];


//validation
function validateRepositoryId(request, response, next) {
  if (!isUuid(request.params.id)) {
    return response.status(400).send()
  }
  return next() 
}



//routes
app.get("/repositories",  (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body
  const repository = { id: uuid(), url, title, techs, likes: 0 }
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", validateRepositoryId,  (request, response) => {
    const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id)
    const repository = repositories[repositoryIndex]
    const { likes } = repository
    const repositoryNew = { id: request.params.id, url: request.body.url, title: request.body.title, techs: request.body.techs, likes }
    repositories[repositoryIndex] = repositoryNew
    return response.json(repositoryNew)
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
    const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id)
    repositories.splice(repositoryIndex, 1)
    return response.status(204).send()
  });

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id)
  const repository = repositories[repositoryIndex]
  const { id, title, url, techs, likes } = repository
  const likesNew = likes + 1;
  const repositoryLiked = { id, title, url, techs, likes: likesNew }
  repositories[repositoryIndex] = repositoryLiked
  return response.json(repositoryLiked)
});

module.exports = app;
