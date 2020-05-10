<script>
  import { Meteor } from "meteor/meteor";
  import { onMount } from "svelte";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { BlazeTemplate } from "meteor/svelte:blaze-integration";
  import Task from "./Task.svelte";
  import { Tasks } from "../api/tasks.js";

  let newTask = "";
  let hideCompleted = false;
  let tasks = [];
  let currentUser;

  onMount(async () => {
    Meteor.subscribe("tasks");
  });

  $: incompleteCount = useTracker(() =>
    Tasks.find({ checked: { $ne: true } }).count()
  );

  $: currentUser = useTracker(() => Meteor.user());

  const taskStore = Tasks.find({}, { sort: { createdAt: -1 } });
  $: {
    tasks = $taskStore;
    if (hideCompleted) {
      tasks = tasks.filter(task => !task.checked);
    }
  }

  function handleSubmit(event) {
    Meteor.call("tasks.insert", newTask);

    // Clear form
    newTask = "";
  }
</script>

<div class="container">

  <header>
    <h1>Todo List ({$incompleteCount})</h1>
    <label className="hide-completed">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input z1"
          bind:checked={hideCompleted} />
        <label class="custom-control-label" for="customCheck1">
          Hide Completed Tasks
        </label>
      </div>

    </label>
    <BlazeTemplate template="loginButtons" />
    {#if $currentUser}
      <form class="new-task" on:submit|preventDefault={handleSubmit}>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">
              New Task
              <i class="fa fa-plus fa-fw" />
            </span>
          </div>
          <input
            type="text"
            class="form-control"
            bind:value={newTask}
            placeholder="Type to add new tasks"
            aria-label="Type to add new tasks"
            aria-describedby="basic-addon1" />
        </div>
      </form>
    {/if}
  </header>
  {#each tasks as task}
    <Task key={task._id} {task} />
  {/each}
</div>
