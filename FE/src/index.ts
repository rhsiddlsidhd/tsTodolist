interface Task {
  id: string;
  content: string;
  isComplete: boolean;
}

const taskInput: HTMLInputElement = document.getElementById(
  "taskInput"
) as HTMLInputElement;
const taskInputBtn: HTMLButtonElement = document.getElementById(
  "taskInputBtn"
) as HTMLButtonElement;
const totaltaskBtn: HTMLInputElement = document.getElementById(
  "totaltask"
) as HTMLInputElement;

//전체리스트
let taskInputList: Task[] = []; //객체 데이터를 담을 배열
let selectedIds: string[] = []; //id 데이터만 담을 배열

//전체 또는 개인 체크박스
const totalCheckBtn = (): void => {
  const allChecked: boolean = taskInputList.every((it) => it.isComplete);

  taskInputList.forEach((it) => {
    it.isComplete = !allChecked;
    const checkbox: HTMLInputElement = document.getElementById(
      it.id
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = it.isComplete;
    }
  });
};

const toggleComplete = (id: string): void => {
  const taskToUpdate: Task = taskInputList.find((it) => it.id === id);

  if (taskToUpdate) {
    taskToUpdate.isComplete = !taskToUpdate.isComplete;
    const allChecked: boolean = taskInputList.every((it) => it.isComplete);

    if (totaltaskBtn) {
      totaltaskBtn.checked = allChecked;
    }
  }
};

taskInputBtn.addEventListener("click", taskInputAddBtn);
totaltaskBtn.addEventListener("click", totalCheckBtn);

//추가버튼
function taskInputAddBtn(): void {
  taskInputList.forEach((task) => {
    task.isComplete = false;
  });

  let taskContent: string | number = taskInput.value;
  let randomId: string = generalRandomId();
  let newTask: Task = { id: randomId, content: taskContent, isComplete: false };
  taskInputList.push(newTask);
  render();
}

//render
const render = (): void => {
  let resultHTML: string = ``;

  const allChecked: boolean = taskInputList.every((it) => it.isComplete);
  if (totaltaskBtn) {
    totaltaskBtn.checked = allChecked;
  }

  for (let i = 0; i < taskInputList.length; i++) {
    resultHTML += `<div class="task-items">
  <div class="checkicon-box">
    <label for="${taskInputList[i].id}" >
      <input
        type="checkbox"
        id=${taskInputList[i].id}
        name="checkboxGroup"
        class="checkicon"
        onClick ="toggleComplete('${taskInputList[i].id}')"
    /></label>
  </div>
  <div class="task">
    <div id="readonly-${taskInputList[i].id}">${taskInputList[i].content}</div>
    <label for="edit-${taskInputList[i].id}">
    <input id="edit-${taskInputList[i].id}" type="text" value="${taskInputList[i].content}"/></label>
  </div>
  <div class="update">
    <button id="edit-Btn-${taskInputList[i].id}" onclick="toggleEditBtn('${taskInputList[i].id}')">수정</button>
    <button id="editComplete-Btn-${taskInputList[i].id}" style="display:none" onclick=editcomplete('${taskInputList[i].id}')>수정완료</button>
  </div>
  <div class="delete">
    <button id=delete-Btn-${taskInputList[i].id} onclick="singlePostDelete('${taskInputList[i].id}')">삭제</button>
    <button id="editCancel-Btn-${taskInputList[i].id}" style="display:none" onclick=editCancel('${taskInputList[i].id}')>수정취소</button>
  </div>
</div>`;
  }
  document.querySelector(".task-items-box")!.innerHTML = resultHTML;
};

//랜덤ID생성
const generalRandomId = (): string => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

/**
 * 단일 삭제
 */
function singlePostDelete(id: string): void {
  const newTaskInputList: Task[] = taskInputList.filter((it) => {
    return it.id !== id;
  });
  taskInputList = newTaskInputList;
  render();
  //전체체크 업데이트
  if (totaltaskBtn) {
    totaltaskBtn.checked = false;
  }
}

/**
 * 선택 삭제
 * 1. 선택된 아이템(id)들을 전부 배열로 받아둔다
 *    => 전체 리스트에서 반복문을 통해 새로운 배열을 생성
 *    => 조건은 isComplete = true 인 Id값만 가져오기
 * 2. 해당 배열을 제외한 나머지 id값들로 list를 새롭게 재선언한다
 * 3. 새롭게 선언한것으로 render한다
 */

function handleMultiDelete(): void {
  const confirm: boolean = window.confirm("선택된 항목을 삭제하시겠습니까?");

  if (confirm) {
    selectedIds = taskInputList
      .filter((it) => it.isComplete)
      .map((it) => it.id);

    const selectedItems: boolean = selectedIds.length > 0;

    if (!selectedItems) {
      alert("선택된 항목이 없습니다.");
      return;
    }

    const updatedTaskInputList: Task[] = taskInputList.filter(
      (it) => !selectedIds.includes(it.id)
    );

    taskInputList = updatedTaskInputList;

    render();

    //전체체크 업데이트
    if (totaltaskBtn) {
      totaltaskBtn.checked = false;
    }
  }
}

/**
 * 전체 삭제
 */

function totalDelete(): void {
  if (taskInputList.length <= 0) {
    alert("삭제할 항목이 없습니다.");
    return;
  }
  const confirmed: boolean = window.confirm("정말 다 삭제하시겠습니까?");
  if (confirmed) {
    taskInputList = [];
    render();

    //전체체크 업데이트
    if (totaltaskBtn) {
      totaltaskBtn.checked = false;
    }
  }
}

/**
 * 수정버튼
 * taskInputList[i].content 부분을 edit input type="text" 로 전환
 *
 */

function toggleEditBtn(id: string): void {
  //text
  let readonlyInputStyle: HTMLElement | null = document.getElementById(
    `readonly-${id}`
  );
  /**
   * 직접적으로 숨겨야 하는 Id와 display:flex를 적용시켜야 하는 input이 아닌 label을 가져와서 flex를 적용
   * [] 속성 선택자
   */
  let editLabel: HTMLElement | null = document.querySelector(
    `label[for="edit-${id}"]`
  );

  readonlyInputStyle.style.display = "none";
  editLabel.style.display = "flex";

  const editBtn: HTMLElement | null = document.getElementById(`edit-Btn-${id}`);
  const editCompleteBtn: HTMLElement | null = document.getElementById(
    `editComplete-Btn-${id}`
  );

  //수정완료 버튼
  editBtn.style.display = "none";
  editCompleteBtn.style.display = "block";

  const editCancelBtn: HTMLElement | null = document.getElementById(
    `editCancel-Btn-${id}`
  );
  const deleteBtn: HTMLElement | null = document.getElementById(
    `delete-Btn-${id}`
  );

  //수정취소 버튼
  deleteBtn.style.display = "none";
  editCancelBtn.style.display = "block";

  /**
   * 수정버튼 클릭시 input에 value 값으로 현재 Id.content 표시
   * 수정완료버튼 시 객체 content 를 업그레이드 render
   * 수정취소 시 객체 content 를 기존 그대로 render
   */
}

//수정완료버튼
function editcomplete(id: string) {
  const readonlyInputStyle: HTMLElement | null = document.getElementById(
    `readonly-${id}`
  );
  const editLabel: HTMLElement | null = document.querySelector(
    `label[for="edit-${id}"]`
  );
  const editBtn: HTMLElement | null = document.getElementById(`edit-Btn-${id}`);
  const editCompleteBtn: HTMLElement | null = document.getElementById(
    `editComplete-Btn-${id}`
  );
  const editCancelBtn: HTMLElement | null = document.getElementById(
    `editCancel-Btn-${id}`
  );
  const deleteBtn: HTMLElement | null = document.getElementById(
    `delete-Btn-${id}`
  );
  const task: HTMLInputElement | null = document.getElementById(
    `edit-${id}`
  ) as HTMLInputElement | null;

  let updatedValue = task.value;
  const taskUpdate = taskInputList.find((it) => it.id === id);
  if (taskUpdate) {
    taskUpdate.content = updatedValue;
  }

  //input 초기화
  readonlyInputStyle.style.display = "flex";
  editLabel.style.display = "none";
  //버튼초기화
  editBtn.style.display = "block";
  editCompleteBtn.style.display = "none";
  editCancelBtn.style.display = "none";
  deleteBtn.style.display = "block";

  render();
}

//수정취소버튼
function editCancel(id: string): void {
  const readonlyInputStyle: HTMLElement | null = document.getElementById(
    `readonly-${id}`
  );
  const editLabel: HTMLElement | null = document.querySelector(
    `label[for="edit-${id}"]`
  );
  const editBtn: HTMLElement | null = document.getElementById(`edit-Btn-${id}`);
  const editCompleteBtn: HTMLElement | null = document.getElementById(
    `editComplete-Btn-${id}`
  );
  const editCancelBtn: HTMLElement | null = document.getElementById(
    `editCancel-Btn-${id}`
  );
  const deleteBtn: HTMLElement | null = document.getElementById(
    `delete-Btn-${id}`
  );

  render();

  //input 초기화
  readonlyInputStyle.style.display = "flex";
  editLabel.style.display = "none";
  //버튼초기화
  editBtn.style.display = "block";
  editCompleteBtn.style.display = "none";
  editCancelBtn.style.display = "none";
  deleteBtn.style.display = "block";
}

console.log("hi");
