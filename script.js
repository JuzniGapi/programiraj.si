const selectElement = document.getElementById('dropdown');
const descriptionElement = document.getElementById('description')
//dodamo listener na problem, da se ob kliku odpre v novem oknu
function addCLickListenerToProblem(problem,metadata){
  
  problem.addEventListener('click', function() {
    //zdej pa dobimo se poglobljen opis problema
    //zdaj pa nalozimo se poglobljen opis problema
    const path = `${metadata.difficulty}/descriptions/${metadata.id}.json`
    fetch(path)
    .then(response => response.json())
    .then(description => {
      
      descriptionElement.innerHTML = `
      <h2>${metadata.title}</h2>    
      <p><b>Navodila:  </b>${description.description}</p>
      <p><b>Oblika vhoda:  </b>${description.input_format}</p>
      <p><b>Oblika izhoda:  </b>${description.output_format}</p>
       <p><b>Omejitve:  </b>${description.constraints}</p>
      <h3> Primeri:</h3> `;
      description.examples.map(item => {
      descriptionElement.innerHTML += `<p><b>Vhod:</b>   ${item.input}<b>    Izhod:</b>   ${item.output}</p>`
          
    });
    })    
  });
}

//tukaj dobimo metapodatke problema, ki jih nato uporabimo za ustvarjanje problema
function createProblem(metadata,i){

  //ime
  const problem = document.createElement('div');
  problem.className = 'problem';
  problem.innerHTML = `<p><b>${i}</b>:  ${metadata.title}</p>`;
  problem.title = 'klikni za vec informacij';

  //zdaj pa nalozimo se poglobljen opis problema
  const path = `${metadata.difficulty}/descriptions/${metadata.id}.json`
  fetch(path)
  .then(response => response.json())
  .then(data => {
    //pa se listener dodamo na klik da vemo pokazati poglobljen opis
    addCLickListenerToProblem(problem,metadata,data);
  })
  
  
  return problem;

}

//tukaj dobimo metapodatke vseh problemov, ki jih nato uporabimo za ustvarjanje problemvo
function fromMetaFileCreate(file){

  //nalozimo metapodatke iz datoteke
  fetch(file) 
  .then(response => response.json())
  .then(data => {

  //za vsak problem iz metapodatkov ustvarimo element
  //in ga dodamo v div problems  
  document.getElementById('problems').innerHTML = ''; 
  let i = 1;
  data.map(item => {    
    const problem = createProblem(item, i);    
    document.getElementById('problems').appendChild(problem);        
    i++;
  });
  })

}

//ko izberemo novo tezavnost, se sprozi ta funkcija
selectElement.addEventListener('change', function() {
  const selectedValue = selectElement.value;
  descriptionElement.innerHTML = '';
  fromMetaFileCreate(`${selectedValue}/metadata.json`)
});
fromMetaFileCreate('easy/metadata.json')