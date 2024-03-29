<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import type { ILetter } from './model/letter';

  export let letter: ILetter = { hasLetter: false, value: '', sameIndex: false, index: 0 };
  export let disabled = false;
  export let hasFocus = false;
  export let selectionMode = false;
  export let row: number;

  let input: HTMLInputElement;

  const dispatch = createEventDispatcher<{ next: void; focus: void; previous: void; enter: void; up: void }>();

  const onlyLetterReg = /^[a-zA-Z]$/;

  function onInput(): void {
    if (!onlyLetterReg.test(input.value)) {
      input.value = '';
    }
  }

  function onFocus(): void {
    input.select();
    dispatch('focus');
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || (event.key === 'Backspace' && !input.value)) {
      event.preventDefault();
      dispatch('previous');
    }
    if (event.key === 'ArrowRight') {
      dispatch('next');
    }
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      dispatch('enter');
    }
    if (event.key === 'ArrowUp') {
      dispatch('up');
    }
    if (onlyLetterReg.test(event.key)) {
      event.preventDefault();
      input.value = (event.key ?? '').toUpperCase();
      letter = { ...letter, value: input.value };
      dispatch('next');
    }
  }

  function onClick(): void {
    if (!selectionMode) {
      return;
    }
    if (letter.hasLetter) {
      if (letter.sameIndex) {
        letter = { ...letter, hasLetter: false, sameIndex: false };
      } else {
        letter = { ...letter, sameIndex: true };
      }
    } else {
      letter = { ...letter, hasLetter: true, sameIndex: false };
    }
  }

  afterUpdate(() => {
    if (input && hasFocus && !selectionMode) {
      input.focus();
    }
  });
</script>

<label class="visually-hidden" for="row-{row}-letter-{letter.index}">Row {row} Letter {letter.index}</label>
<input
  id="row-{row}-letter-{letter.index}"
  bind:this={input}
  bind:value={letter.value}
  class="letter form-control"
  class:has-letter={letter.hasLetter}
  class:same-index={letter.sameIndex}
  maxlength="1"
  {disabled}
  on:input={onInput}
  on:focus={onFocus}
  on:keydown={onKeydown}
  on:click={onClick}
  readonly={selectionMode && !disabled}
  title={selectionMode && !disabled ? 'Click to change the state' : ''}
/>

<style>
  .letter {
    width: 40px;
    margin: 0.25rem 0.5rem;
    text-align: center;
  }

  .form-control.letter[readonly] {
    user-select: none;
  }

  .form-control.letter.has-letter[readonly],
  .form-control.letter.has-letter[disabled],
  .form-control.letter.has-letter:disabled {
    background-color: yellow;
  }

  .form-control.letter.has-letter.same-index[readonly],
  .form-control.letter.has-letter.same-index[disabled],
  .form-control.letter.has-letter.same-index:disabled {
    background-color: greenyellow;
  }

  .form-control.letter[readonly] {
    background-color: #fff;
  }
</style>
