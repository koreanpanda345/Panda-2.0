$('.categories li').on('click', setCategory);

function setCategory() {
  blank();

  const selected = $(this);
  selected.addClass('active');  

  const categoryCommands = $(`.commands .${selected[0].id}`);
  categoryCommands.show();
  
  updateResultsText(categoryCommands);
}