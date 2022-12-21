let inpName = document.getElementsByTagName("input")[0];
let inpSurname = document.getElementsByTagName("input")[1];
let inpNum = document.getElementsByTagName("input")[2];
let inpImg = document.getElementsByTagName("input")[3];
let addBtn = document.getElementById("add-btn");
let container = document.getElementsByClassName('container')[0]

let modal = document.getElementsByClassName('main-modal')[0]

let editName = document.getElementsByClassName('editName')[0]
let editSurname = document.getElementsByClassName('editSurname')[0]
let editNum = document.getElementsByClassName('editNum')[0]
let editImg = document.getElementsByClassName('editImg')[0]

let closeBtn = document.getElementsByClassName('btn-closer')[0]
let saveBtn = document.getElementsByClassName('btn-save')[0]


render()


addBtn.addEventListener("click", async () => {
  if (
    !inpName.value.trim() ||
    !inpSurname.value.trim() ||
    !inpNum.value.trim() ||
    !inpImg.value.trim()
  ) {
    alert("Заполните поля!");
    return;
  }
  let obj = {
    name: inpName.value,
    surname: inpSurname.value,
    number: inpNum.value,
    img: inpImg.value,
  };
//   console.log(obj);
  await setDoJson(obj);
  render()
});

async function setDoJson(obj) {
  let options = {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch("http://localhost:8002/contacts", options);
}

async function getDoJson(){
    let data = await fetch('http://localhost:8002/contacts')
    let data2 = await data.json()
    return data2
}

async function render(){
    let data = await getDoJson()
    container.innerHTML = ''
    data.forEach(item => {
        let div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML += `
        <div class='imgClass'><img src="${item.img}" alt=""></div> 
        <p class="cartName">Name: ${item.name}</p>
        <p class="cartSurname">Surname: ${item.surname}</p>
        <p class="cartNum">Number: ${item.number}</p>`

        const btnDelete = document.createElement('button');
        btnDelete.innerText = 'Delete';
        btnDelete.id = item.id
        btnDelete.classList.add('delete-btn');

        btnDelete.addEventListener('click', function(event){
            Delete(event.target.id)
        })

        const btnEdit = document.createElement('button');
        btnEdit.innerText = 'Edit';
        btnEdit.classList.add('edit-btn');

        btnEdit.addEventListener('click', function (event){
          event.stopPropagation()
          edit(item.id)
        });
        div.append(btnDelete)
        div.append(btnEdit)
        container.append(div)
    });
}

async function Delete(id) {
    await fetch(`http://localhost:8002/contacts/${id}`, {method: 'DELETE'})
    render()
}

async function edit(id){
    let data = await fetch(`http://localhost:8002/contacts/${id}`)
    let data2 = await data.json()
    modal.style.display = 'block'
    editName.value = data2.name
    editSurname.value = data2.surname
    editNum.value = data2.number
    editImg.value = data2.img
    saveBtn.id = id
}

closeBtn.addEventListener('click', ()=> {
    modal.style.display = 'none';
})


saveBtn.addEventListener('click', async(event) => {
    if (
        !editName.value.trim() ||
        !editSurname.value.trim() ||
        !editNum.value.trim() ||
        !editImg.value.trim()
      ) {
        alert("Заполните поля!");
        return;
      }
      modal.style.display = 'none';

      let obj = {
        method: 'PATCH',
        body: JSON.stringify({name: editName.value, surname: editSurname.value, number: editNum.value, img: editImg.value}),
        headers: {
            "Content-Type": "application/json",
          }
      }
      await fetch(`http://localhost:8002/contacts/${event.target.id}`, obj)
      render()



})