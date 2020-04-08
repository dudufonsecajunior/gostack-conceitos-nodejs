const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//validate repository id
function validateRepositoryId (request, response, next) {

  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error : "Invalid project ID"})
  }

  return next();

}

//Check repository exist
function checkRepositoryExist(request, response, next){
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0){
    return response.status(400).json({ error : "project not found!"});
  }

  return next();

}

app.use('/repositories/:id', validateRepositoryId, checkRepositoryExist)

app.get("/repositories", (request, response) => {

  return response.json(repositories)

});

app.post("/repositories", (request, response) => {
  const likes = 0
  
  const {title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs , likes}

  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  
  const {id} = request.params;
  const {title, url,techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  const likes = repositories[repositoryIndex].likes

  const repository = { 
    id,
    title, 
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  repositories.splice(repositoryIndex,1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  const repository = repositories[repositoryIndex];
  
  const likes = repositories[repositoryIndex].likes + 1

  repository.likes = likes

  repositories[repositoryIndex] = repository;

  return response.json( {likes : repository.likes})

});

module.exports = app;
