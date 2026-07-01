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
document.getElementById("priorityDropdown").dataset.value;

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



    if(taskText === ""){
        return;
    }

    const li = document.createElement("li");


  li.innerHTML = createTaskCard(
    taskText,
    category,
    priority,
    dueDate,
    formattedDate,
    false
);

   attachTaskEvents(li);

    
    

    document
.getElementById("taskList")
.appendChild(li);
li.animate(

[
{
opacity:0,
transform:"translateY(25px)"
},
{
opacity:1,
transform:"translateY(0)"
}
],

{
duration:350,
easing:"ease-out"
}

);

taskInput.value = "";
document.getElementById("dueDate").value = "";

saveTasks();

updateStats();

refreshTaskView();


showToast("✅ Task Added");
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

  const progress =
total === 0
? 0
: Math.round((completed / total) * 100);

animateCounter(
"totalTasks",
total
);

animateCounter(
"completedTasks",
completed
);

animateCounter(
"pendingTasks",
pending
);

animateCounter(
"progressPercent",
progress,
"%"
);


const fill =
document.getElementById(
    "progressFill"
);

fill.style.transition =
"width .8s cubic-bezier(.22,.61,.36,1)";

requestAnimationFrame(()=>{

fill.style.width=
progress+"%";

});
const emptyState =
document.getElementById("emptyState");

const taskList =
document.getElementById("taskList");

if(total === 0){

    emptyState.style.display = "block";
    taskList.style.display = "none";

}
else{

emptyState.style.display = "none";
    taskList.style.display = "block";

}
}
function saveTasks(){

    const tasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {

        tasks.push({

            text: li.querySelector(".task-text").textContent,

            category: li.querySelector(".category-tag").textContent.trim(),

            priority: li.querySelector(".priority-tag").textContent.trim(),

           dueDate: li.querySelector(".due-date")
    ? li.querySelector(".due-date").dataset.date
    : "",

            completed: li.classList.contains("completed"),

            pinned: li.classList.contains("pinned")

        });

    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

window.onload = function(){

    const savedTasks = JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

    savedTasks.forEach(task => {

        const li = document.createElement("li");

        let formattedDate = "";

        if(task.dueDate){

            formattedDate = new Date(task.dueDate)
            .toLocaleDateString("en-GB",{
                day:"numeric",
                month:"short",
                year:"numeric"
            });

        }

       li.innerHTML = createTaskCard(
    task.text,
    task.category,
    task.priority,
    task.dueDate,
    formattedDate,
    task.pinned
);

        if(task.completed){
            li.classList.add("completed");
        }

        if(task.pinned){
    li.classList.add("pinned");
}

        attachTaskEvents(li);

        document.getElementById("taskList")
        .appendChild(li);

    });

    updateStats();
    refreshTaskView();

}
document.addEventListener("keydown", function(event){

    if(event.key !== "Enter"){
        return;
    }

    // Don't interfere while editing a task
    if(document.querySelector(".edit-input")){
        return;
    }

    // Don't submit if the user is typing somewhere else
    const active = document.activeElement;

    if(
        active.tagName === "TEXTAREA" ||
        (
            active.tagName === "INPUT" &&
            active.id !== "taskInput" &&
            active.id !== "dueDate"
        )
    ){
        return;
    }

    event.preventDefault();
    addTask();

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


refreshTaskView();
        }
    );

});
function filterTasks(filter){

    

    const tasks =
    document.querySelectorAll(
        "#taskList li"
    );

    tasks.forEach(task => {

      

if(filter === "All"){

            task.style.display =
            "flex";
        }

        else if(
            filter === "Completed"
        ){

            

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
document.getElementById("clearAllBtn")
.addEventListener("click", function(){

    if(confirm("Delete all tasks?")){

        document.getElementById("taskList").innerHTML = "";

       saveTasks();
updateStats();

showToast("🧹 All Tasks Cleared","#dc2626");

    }

});
function searchTasks(){

    const searchText =
    document.getElementById(
        "searchTask"
    ).value.toLowerCase();
    

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
       
if(taskName.includes(searchText)){
task.style.display = "flex";

}
else{
    task.style.display = "none";

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
    const taskList = document.getElementById("taskList");
    const today = new Date();
today.setHours(0,0,0,0);
   const sortedTasks = [...tasks].sort((a, b) => {

   const dueA =
a.querySelector(".due-date");

const dueB =
b.querySelector(".due-date");

const dateA =
dueA
? dueA.dataset.date
: "9999-12-31";

const dateB =
dueB
? dueB.dataset.date
: "9999-12-31";

    const completedA = a.classList.contains("completed");
const completedB = b.classList.contains("completed");
const pinnedA = a.classList.contains("pinned");
const pinnedB = b.classList.contains("pinned");
const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
};

const priorityA =
priorityOrder[
    a.querySelector(".priority-tag").textContent.trim()
];

const priorityB =
priorityOrder[
    b.querySelector(".priority-tag").textContent.trim()
];

if (pinnedA !== pinnedB) {
    return pinnedA ? -1 : 1;
}

if (completedA !== completedB) {
    return completedA ? 1 : -1;
}



const diffA =
Math.floor((new Date(dateA) - today) / (1000*60*60*24));

const diffB =
Math.floor((new Date(dateB) - today) / (1000*60*60*24));

function urgency(diff){

    if(diff < 0) return 0;   // Overdue

    if(diff === 0) return 1; // Today

    if(diff === 1) return 2; // Tomorrow

    return 3;                // Future

}

const urgencyA = urgency(diffA);
const urgencyB = urgency(diffB);

if(urgencyA !== urgencyB){

    return urgencyA - urgencyB;

}

if(priorityA !== priorityB){

    return priorityA - priorityB;

}

return new Date(dateA) - new Date(dateB);

});
sortedTasks.forEach(task => {
    taskList.appendChild(task);
});

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
const dueElement =
task.querySelector(".due-date");

task.classList.remove("overdue");

if(dueElement){

    const due =
    new Date(dueElement.dataset.date);

    due.setHours(0,0,0,0);

    if(
        due < today &&
        !isCompleted
    ){

        task.classList.add("overdue");

    }

}

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
const visibleTasks =
document.querySelectorAll(
    '#taskList li[style*="flex"]'
).length;

const noSearch =
document.getElementById(
    "noSearchResult"
);

if(
    visibleTasks === 0 &&
    searchText !== ""
){

    noSearch.style.display = "block";

}
else{

    noSearch.style.display = "none";

}

}

setupDropdown(
    "categoryDropdown",
    "selectedCategory"
);

setupDropdown(
    "priorityDropdown",
    "selectedPriority"
);

function setupDropdown(dropdownId, textId){

    const dropdown =
    document.getElementById(dropdownId);

    const selected =
    dropdown.querySelector(".selected-option");

    const options =
    dropdown.querySelectorAll(".option");

    selected.addEventListener("click", function(){

        dropdown.classList.toggle("open");

    });

    options.forEach(option=>{

        option.addEventListener("click", function(){

            document.getElementById(textId)
            .textContent =
            this.textContent;

            dropdown.dataset.value =
            this.dataset.value;

            dropdown.classList.remove("open");

        });

    });

    document.addEventListener("click", function(e){

        if(!dropdown.contains(e.target)){

            dropdown.classList.remove("open");

        }

    });

}



function createTaskCard(
    taskText,
    category,
    priority,
    dueDate,
    formattedDate,
    pinned = false
){

    return `
<div class="task-info">

    <div class="task-top">

        <div class="badges">

            <span class="category-tag ${category.toLowerCase()}">
                ${category}
            </span>

            <span class="priority-tag ${priority.toLowerCase()}">
                ${priority}
            </span>

        </div>

        ${
            pinned
            ? `<span class="pin-indicator">📌 Pinned</span>`
            : ""
        }

    </div>

    <div class="task-text">
        ${taskText}
    </div>

   <div class="task-bottom">

    <div class="task-meta">

        ${
            formattedDate
            ? `<span class="due-date" data-date="${dueDate}">
                    📅 ${formattedDate}
               </span>`
            : ""
        }

        ${getTaskStatus(dueDate)}

        <div class="actions">

            <button class="pin-btn">
                ${pinned ? "📌" : "⭐"}
            </button>

            <button class="edit-btn">
                ✏️
            </button>

            <button class="complete-btn">
                ✓
            </button>

            <button class="delete-completed-btn">
                🧹
            </button>

            <button class="delete-btn">
                🗑
            </button>

        </div>

    </div>

</div>

</div>
`;

}
function attachTaskEvents(li){
    li.querySelector(".pin-btn")
.addEventListener("click", function(){
    

  li.classList.toggle("pinned");
  this.animate(

[
{
transform:"scale(1)"
},
{
transform:"scale(1.35)"
},
{
transform:"scale(1)"
}
],

{
duration:250
}

);
  this.textContent = li.classList.contains("pinned") ? "📌" : "⭐";

refreshTaskView();
saveTasks();

showToast(
    li.classList.contains("pinned")
    ? "📌 Task Pinned"
    : "⭐ Task Unpinned",
    "#f59e0b"
);

});
    li.querySelector(".complete-btn")
.addEventListener("click", function(){

    li.classList.toggle("completed");
    li.animate(

[
{
transform:"scale(1)"
},
{
transform:"scale(.97)"
},
{
transform:"scale(1)"
}
],

{
duration:250
}

);
    const taskList = document.getElementById("taskList");

if (li.classList.contains("completed")) {
    taskList.appendChild(li);
} else {
    taskList.prepend(li);
}

   updateStats();
saveTasks();
refreshTaskView();

showToast(
    li.classList.contains("completed")
    ? "✅ Task Completed"
    : "↩️ Task Restored",
    "#22c55e"
);

});
    li.querySelector(".edit-btn")
.addEventListener("click", function(){

   const taskText = li.querySelector(".task-text");

const currentText =
taskText.textContent.trim();

taskText.innerHTML = `
<input
type="text"
class="edit-input"
value="${currentText}"
spellcheck="false"
autocomplete="off">
`;

const actions = li.querySelector(".actions");

actions.innerHTML = `
<button class="save-btn">💾</button>
<button class="cancel-btn">❌</button>
`;
const saveBtn = li.querySelector(".save-btn");

const cancelBtn = li.querySelector(".cancel-btn");
const editInput = li.querySelector(".edit-input");  
setTimeout(() => {

    editInput.focus();

    editInput.setSelectionRange(0, 0);

}, 0);
  
editInput.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        saveBtn.click();

    }
    if(event.key === "Escape"){

    cancelBtn.click();

}

});
saveBtn.addEventListener("click", function(){
    const editInput = li.querySelector(".edit-input");

    const newText = editInput.value.trim();

if(newText === ""){
    showToast("⚠️ Task cannot be empty","#ef4444");
    return;
}

    taskText.textContent = newText;

actions.innerHTML = `
<button class="pin-btn">${li.classList.contains("pinned") ? "📌" : "⭐"}</button>
<button class="edit-btn">✏️</button>
<button class="complete-btn">✓</button>
<button class="delete-completed-btn">🧹</button>
<button class="delete-btn">🗑</button>
`;

attachTaskEvents(li);
saveTasks();

showToast("✏️ Task Updated","#3b82f6");

});
cancelBtn.addEventListener("click", function(){

    taskText.textContent = currentText;

   actions.innerHTML = `
<button class="pin-btn">${li.classList.contains("pinned") ? "📌" : "⭐"}</button>
<button class="edit-btn">✏️</button>
<button class="complete-btn">✓</button>
<button class="delete-completed-btn">🧹</button>
<button class="delete-btn">🗑</button>
`;

    attachTaskEvents(li);
    saveTasks();

});


});
li.querySelector(".delete-completed-btn")
.addEventListener("click", function(){

    if(!confirm("Delete all completed tasks?")){
        return;
    }

    document.querySelectorAll("#taskList li.completed").forEach(task => {
        task.remove();
    });

    updateStats();
    saveTasks();

    showToast(
        "🧹 Completed Tasks Deleted",
        "#ea580c"
    );

});
li.querySelector(".delete-btn")
.addEventListener("click", function(){

    const confirmDelete = confirm(
        "Delete this task?"
    );

    if(!confirmDelete){
        return;
    }

li.style.transition =
"all .35s ease";

li.style.opacity = "0";

li.style.transform =
"translateX(60px) scale(.9)";

setTimeout(()=>{

    li.remove();

    updateStats();

    saveTasks();

},350);

showToast("🗑 Task Deleted","#ef4444");

});
}
function animateCounter(id,target,suffix=""){

const element=
document.getElementById(id);

const start=
parseInt(element.textContent)||0;

const duration=500;

const startTime=
performance.now();

function update(now){

const progress=
Math.min(
(now-startTime)/duration,
1
);

const value=Math.round(

start+
(target-start)*progress

);

element.textContent=
value+suffix;

if(progress<1){

requestAnimationFrame(update);

}

}

requestAnimationFrame(update);

}
function showToast(message, color = "#22c55e"){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2000);

}
function getTaskStatus(dueDate){

    if(!dueDate){
        return "";
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const due = new Date(dueDate);
    due.setHours(0,0,0,0);

    const difference =
    Math.floor((due - today) / (1000 * 60 * 60 * 24));

    if(difference < 0){
        return `<span class="status-badge overdue">🔴 Overdue</span>`;
    }

    if(difference === 0){
        return `<span class="status-badge today">🟠 Due Today</span>`;
    }

    if(difference === 1){
        return `<span class="status-badge tomorrow">🟢 Due Tomorrow</span>`;
    }

    return "";
}
window.addEventListener("beforeunload", function(event){

    if(document.querySelector(".edit-input")){

        event.preventDefault();

        event.returnValue = "";

    }

});