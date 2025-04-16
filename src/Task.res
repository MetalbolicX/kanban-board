open Van

type task = {
  id: string,
  description?: string,
}

let create = task =>
  Dom.createElement("li")
  ->Dom.withProps({"class": "kanban__task", "draggable": true, "data-id": task.id})
  ->Dom.addChildren([
    Dom.createElement("textarea")
    ->Dom.withProps({
      "class": "kanban__task-description",
      "autocorrect": true,
      "spellcheck": true,
      "value": task.description,
    })
    ->Dom.build
    ->Child.toDom,
    Dom.createElement("div")
    ->Dom.withProps({"class": "kanban__task-actions"})
    ->Dom.addChild(
      Dom.createElement("button")
      ->Dom.withProps({
        "class": "kanban__task-delete",
        "type": "button",
        "onclick": _ => Console.log("Task deleted"),
      })
      ->Dom.addChild("🗑"->Child.toText)
      ->Dom.build
      ->Child.toDom,
    )
    ->Dom.build
    ->Child.toDom,
  ])
  ->Dom.build
