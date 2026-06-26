function addTask(){

    const taskInput =
    document.getElementById("taskInput");

    const taskText =
    taskInput.value.trim();
   const category =
document.getElementById(
    "categoryDropdown"
).dataset.value;
const dueDate =
document.getElementById(
    "dueDate"
).value;
const priority =
document.getElementById(
    "prioritySelect"
).value;

let formattedDate = "";

if(dueDate){

    formattedDate =
    new Date(dueDate)
    .toLocaleDateString(
        "en-GB",
        {
            day:"numeric",
            month:"short",
            year:"numeric"
        }
    );
}

console.log(dueDate);

    if(taskText === ""){
        return;
    }

    const li = document.createElement("li");
    console.log("Reached li creation");

   li.innerHTML = `

   <div class="task-info">

    <div class="task-top">

        <span class="category-tag ${category.toLowerCase()}">
            ${category}
        </span>

        <span class="priority-tag ${priority.toLowerCase()}">
            ${priority}
        </span>

    </div>

    <span class="task-text">
        ${taskText}
    </span>
       <span class="due-date" data-date="${dueDate}">
    ${formattedDate
    ? `📅 Due: ${formattedDate}`
    : ""}
</span>

    </div>

    <div class="actions">

        <button class="complete-btn">
            ✓
        </button>

        <button class="delete-btn">
            🗑
        </button>

    </div>
`;

   li.querySelector(".complete-btn")
.addEventListener("click", function(){

    li.classList.toggle("completed");

    updateStats();

    saveTasks();

   refreshTaskView();

});

    li.querySelector(".delete-btn")
    .addEventListener("click", function(){

        li.remove();

        updateStats();
    });

    document
    .getElementById("taskList")
    .appendChild(li);
    console.log("Task added");
saveTasks();
    taskInput.value = "";

    updateStats();
saveTasks();
}
function updateStats(){

    const total =
    document.querySelectorAll("#taskList li").length;

    const completed =
    document.querySelectorAll(
        "#taskList li.completed"
    ).length;

    const pending =
    total - completed;

    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;

    document.getElementById(
        "pendingTasks"
    ).textContent = pending;
    const progress =
total === 0
? 0
: Math.round((completed / total) * 100);

document.getElementById(
    "progressPercent"
).textContent = progress + "%";
document.getElementById(
    "progressFill"
).style.width = progress + "%";
}
function saveTasks(){

    localStorage.setItem(
        "tasks",
        document.getElementById("taskList").innerHTML
    );
}
function attachEvents(){

    document
    .querySelectorAll(".complete-btn")
    .forEach(button => {

        button.onclick = function(){

            const li =
            this.closest("li");

            li.classList.toggle(
                "completed"
            );

            updateStats();
            saveTasks();
        };
    });

    document
    .querySelectorAll(".delete-btn")
    .forEach(button => {

        button.onclick = function(){

            this.closest("li").remove();

            updateStats();
            saveTasks();
        };
    });
}
window.onload = function(){

    const savedTasks =
    localStorage.getItem("tasks");

    if(savedTasks){

        document.getElementById(
            "taskList"
        ).innerHTML = savedTasks;

        attachEvents();

        updateStats();
    }
}
document.getElementById("taskInput")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        addTask();
    }

});
const filterButtons =
document.querySelectorAll(
    ".filter-btn"
);

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function(){

            filterButtons.forEach(btn =>
                btn.classList.remove(
                    "active"
                )
            );

            this.classList.add(
                "active"
            );

           console.log("Button clicked:", this.textContent);

refreshTaskView();
        }
    );

});
function filterTasks(filter){

    console.log("Filter:", filter);

    const tasks =
    document.querySelectorAll(
        "#taskList li"
    );

    tasks.forEach(task => {

        console.log("Current filter =", filter);

if(filter === "All"){

            task.style.display =
            "flex";
        }

        else if(
            filter === "Completed"
        ){

            console.log(task);
console.log(task.className);

if(
    task.classList.contains(
        "completed"
    )
){
                task.style.display =
                "flex";
            }
            else{
                task.style.display =
                "none";
            }
        }

       else if(
    filter === "Pending"
){

    if(
        !task.classList.contains(
            "completed"
        )
    ){
        task.style.display =
        "flex";
    }
    else{
        task.style.display =
        "none";
    }
}
    });

}
document.getElementById("addBtn")
.addEventListener("click", addTask);
document.getElementById(
    "searchTask"
).addEventListener(
    "input",
    refreshTaskView
);
function searchTasks(){

    const searchText =
    document.getElementById(
        "searchTask"
    ).value.toLowerCase();
    console.log("Searching:", searchText);

    const tasks =
    document.querySelectorAll(
        "#taskList li"
    );

    tasks.forEach(task => {

        const taskTextElement =
task.querySelector(".task-text");

if(!taskTextElement){
    return;
}

const taskName =
taskTextElement.textContent.toLowerCase();
       console.log(taskName, taskName.includes(searchText));

if(taskName.includes(searchText)){
task.style.display = "flex";
console.log("Visible:", taskName);
}
else{
    task.style.display = "none";
console.log("Hidden:", taskName);
}

    });

}

function refreshTaskView(){

    const searchText =
    document.getElementById(
        "searchTask"
    ).value.toLowerCase();

    const activeFilter =
    document.querySelector(
        ".filter-btn.active"
    ).textContent.trim();

    const tasks =
    document.querySelectorAll(
        "#taskList li"
    );
    tasks.forEach(task => {

    const taskText =
    task.querySelector(
        ".task-text"
    );

    if(!taskText){
        return;
    }

    const taskName =
    taskText.textContent.toLowerCase();
    const matchesSearch =
taskName.includes(searchText);

const isCompleted =
task.classList.contains(
    "completed"
);

let matchesFilter = false;

if(activeFilter === "All"){

    matchesFilter = true;

}
else if(
    activeFilter === "Completed"
){

    matchesFilter = isCompleted;

}
else if(
    activeFilter === "Pending"
){

    matchesFilter = !isCompleted;

}

if(
    matchesSearch &&
    matchesFilter
){

    task.style.display = "flex";

}
else{

    task.style.display = "none";

}


});

}

const categoryDropdown =
document.getElementById("categoryDropdown");

const selectedOption =
categoryDropdown.querySelector(".selected-option");

const options =
categoryDropdown.querySelectorAll(".option");

selectedOption.addEventListener("click", function () {

    categoryDropdown.classList.toggle("open");

});

options.forEach(option => {

    option.addEventListener("click", function () {

        document.getElementById(
            "selectedCategory"
        ).textContent = this.textContent;

        categoryDropdown.dataset.value =
        this.dataset.value;

        categoryDropdown.classList.remove("open");

    });

});
document.addEventListener("click", function(event){

    if(!categoryDropdown.contains(event.target)){

        categoryDropdown.classList.remove("open");

    }

});