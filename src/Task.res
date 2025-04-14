type task = {
  id: string,
  description?: string,
}

let create: task => Dom.element = task => {
  Van.Tags.createTag(
    ~tagName="li",
    ~properties={"class": "kanban__task", "draggable": true, "data-id": task.id},
  )
}
