<script>
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { Tasks } from "../api/tasks.js";

  export let key;
  export let task;
  let showPrivateButton;

  $: currentUser = useTracker(() => Meteor.user());

  $: {
    showPrivateButton = false;
    if ($currentUser) {
      showPrivateButton = task.owner === $currentUser._id;
    }
  }

  function toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call("tasks.setChecked", task._id, !task.checked);
  }

  function deleteThisTask() {
    Meteor.call("tasks.remove", task._id);
  }

  function togglePrivate() {
    Meteor.call("tasks.setPrivate", task._id, !task.private);
  }
</script>

<div class="card shadow my-2 border-0">
  <div class="card-body">
    <p class="card-text">
      <strong>{task.username}</strong>
      : {task.text}
    </p>
    <div class="custom-control custom-checkbox">
      <input
        type="checkbox"
        class="custom-control-input z1"
        checked={!!task.checked}
        on:click={toggleChecked} />
      <label class="custom-control-label" for="customCheck1">Mark done</label>
    </div>

    <button class="btn btn-danger btn-sm" on:click={deleteThisTask}>
      &times;
    </button>

    {#if showPrivateButton}
      <button class="btn btn-primary" on:click={togglePrivate}>
        {task.private ? 'Private' : 'Public'}
      </button>
    {/if}

    <span class="text-info" />
  </div>
</div>
