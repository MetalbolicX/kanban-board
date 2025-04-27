type task = {
  id: string,
  description?: string,
}

let create: task => Dom.element = task =>
  Van.Dom.createElement("li")
  ->Van.Dom.setAttrs({
    "class": "kanban__task",
    "draggable": true,
    "data-id": task.id,
    "ondragstart": (evt: Dom.event) => Console.log(evt),
  })
  ->Van.Dom.addChildren([
    Van.Dom.createElement("textarea")
    ->Van.Dom.setAttrs({
      "class": "kanban__task-description",
      "autocorrect": true,
      "spellcheck": true,
      "value": task.description,
    })
    ->Van.Dom.build
    ->Van.Child.toDom,
    Van.Dom.createElement("div")
    ->Van.Dom.setAttrs({"class": "kanban__task-actions"})
    ->Van.Dom.addChild(
      Van.Dom.createElement("button")
      ->Van.Dom.setAttrs({
        "class": "kanban__task-delete",
        "type": "button",
        "onclick": _ => Console.log("Task deleted"),
      })
      ->Van.Dom.addChild("🗑"->Van.Child.toText)
      ->Van.Dom.build
      ->Van.Child.toDom,
    )
    ->Van.Dom.build
    ->Van.Child.toDom,
  ])
  ->Van.Dom.build
