document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.querySelector('#dog-bar');
    const dogInfo = document.querySelector('#dog-info');
    const filterButton = document.querySelector('#good-dog-filter');
  
    let allDogs = [];
    let filteredDogs = [];
  
    function renderDogs(dogs) {
      dogBar.innerHTML = '';
      dogs.forEach(dog => {
        const span = document.createElement('span');
        span.innerText = dog.name;
        dogBar.appendChild(span);
  
        span.addEventListener('click', () => {
          dogInfo.innerHTML = `
            <img src="${dog.image}">
            <h2>${dog.name}</h2>
            <button>${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
          `;
  
          const dogButton = dogInfo.querySelector('button');
          dogButton.addEventListener('click', () => {
            const isGoodDog = !dog.isGoodDog;
            fetch(`http://localhost:3000/pups/${dog.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ isGoodDog })
            })
            .then(response => response.json())
            .then(updatedDog => {
              dog.isGoodDog = updatedDog.isGoodDog;
              dogButton.innerText = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
              if (filterButton.innerText === 'Filter good dogs: ON') {
                renderDogs(filteredDogs);
              }
            });
          });
        });
      });
    }
  
    function toggleFilter() {
      if (filterButton.innerText === 'Filter good dogs: OFF') {
        filterButton.innerText = 'Filter good dogs: ON';
        filteredDogs = allDogs.filter(dog => dog.isGoodDog);
        renderDogs(filteredDogs);
      } else {
        filterButton.innerText = 'Filter good dogs: OFF';
        renderDogs(allDogs);
      }
    }
  
    filterButton.addEventListener('click', toggleFilter);
  
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(dogs => {
        allDogs = dogs;
        renderDogs(allDogs);
      });
  });
  