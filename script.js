const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const allBtn = document.getElementById('allBtn');
const completedBtn = document.getElementById('completedBtn');
const pendingBtn = document.getElementById('pendingBtn');
const taskList = document.getElementById('taskList');

let tasks = [];
let newTaskList=[];

async function displayTask() {

    taskList.innerHTML = '';
    const response = await fetch('https://jsonplaceholder.typicode.com/posts',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    let data =await response.json();
    // console.log("data",data);

    tasks.push(...data);
    tasks.unshift(...newTaskList)
    newTaskList=[];
    
    // console.log("tasks==",tasks);

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.textContent = task.title;
        li.className = task.completed ? 'completed' : '';
        li.addEventListener('click', () => toggleTaskCompletion(task.id));
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => deleteTask(task.id));
        li.appendChild(removeButton);
        taskList.appendChild(li);
    });





}
addTaskBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim().toLowerCase();
    if (task === '') {
        alert('Task cannot be empty');
        return;

    }

    const newTask = {
        title: task,
        completed: false,
        id: Date.now()

    }
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    });
    newTaskList.push(newTask);


    taskInput.value = '';
    displayTask();
    


});


async function toggleTaskCompletion(id) {
    let task = tasks.find(task => task.id === id);


    if (task) {
        task.completed = !task.completed;

        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

    }
}

async function deleteTask(id) {
    let taskIndex = tasks.findIndex(task => task.id === id);


    if (taskIndex !== -1) {

        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'DELETE',
        });


    }
}



allBtn.addEventListener('click', () => displayTask());

pendingBtn.addEventListener('click', () =>{
    tasks = tasks.filter(task =>!task.completed);
    displayTask();


});

completedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => task.completed);
    displayTask();
})





