const tasks = [
  {title:"Finish English essay outline",subject:"English · Due today",done:true,person:"AM"},
  {title:"Review algebra — Chapter 5",subject:"Mathematics · Shared",done:false,person:"AM"},
  {title:"Prepare presentation slides",subject:"Computer Science · 4:00 PM",done:false,person:"IM"},
  {title:"Read biology chapter 7",subject:"Biology · Tomorrow",done:false,person:"AM"}
];

const taskList=document.getElementById("taskList"), allTasks=document.getElementById("allTasks");
function renderTasks(){
  const html=tasks.map((t,i)=>`<div class="task-item"><button class="check ${t.done?"done":""}" data-task="${i}">${t.done?"✓":""}</button><div><b>${t.title}</b><small>${t.subject}</small></div><div class="avatar tiny ${t.person==="AM"?"second":""}">${t.person}</div></div>`).join("");
  if(taskList) taskList.innerHTML=html;
  if(allTasks) allTasks.innerHTML=html;
}
renderTasks();

document.addEventListener("click",e=>{
  const nav=e.target.closest(".nav-item[data-page]");
  const target=e.target.closest("[data-page-target]");
  if(nav) switchPage(nav.dataset.page);
  if(target) switchPage(target.dataset.pageTarget);
  const check=e.target.closest(".check");
  if(check){tasks[+check.dataset.task].done=!tasks[+check.dataset.task].done;renderTasks();showToast(tasks[+check.dataset.task].done?"Nice work! Task completed ✨":"Task moved back to your list");}
});

function switchPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===page));
  document.querySelectorAll(".nav-item[data-page]").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
  document.querySelector(".sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}

const modal=document.getElementById("modal");
function openModal(){modal.classList.add("open");setTimeout(()=>document.getElementById("newTask").focus(),100)}
document.getElementById("addTaskBtn").onclick=openModal;
document.getElementById("addTaskBtn2").onclick=openModal;
document.getElementById("closeModal").onclick=()=>modal.classList.remove("open");
document.getElementById("cancelModal").onclick=()=>modal.classList.remove("open");
document.getElementById("saveTask").onclick=()=>{
  const input=document.getElementById("newTask"), title=input.value.trim();
  if(!title){input.focus();return}
  tasks.unshift({title,subject:"New shared task · Just added",done:false,person:"AM"});
  renderTasks();input.value="";modal.classList.remove("open");showToast("Task added successfully ✨");
};
document.getElementById("mobileMenu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");

function showToast(text){const t=document.getElementById("toast");t.textContent=text;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2500)}

document.getElementById("chatForm").addEventListener("submit",e=>{
  e.preventDefault();const input=document.getElementById("chatInput"), text=input.value.trim();if(!text)return;
  const body=document.getElementById("chatBody");body.insertAdjacentHTML("beforeend",`<div class="bubble me">${escapeHtml(text)}</div>`);input.value="";body.scrollTop=body.scrollHeight;
  setTimeout(()=>{body.insertAdjacentHTML("beforeend",`<div class="bubble other">Got it! 🙌 Let’s keep helping each other.</div>`);body.scrollTop=body.scrollHeight},700);
});
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

const chart=document.getElementById("chart"), heights=[38,52,45,78,62,92,68];
chart.innerHTML=heights.map((h,i)=>`<div style="height:${h}%"><span>${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>`).join("");
