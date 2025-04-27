type column = {
  id: string,
  title: string,
  tasks?: array<Task.task>,
}

@val @scope("document") @return(nullable)
external querySelector: string => option<Dom.element> = "querySelector"

@val @scope(("window", "crypto"))
external randomUUID: unit => string = "randomUUID"

@send external preventDefault: Dom.dragEvent => unit = "preventDefault"
@get external getTargetMenu: Dom.dragEvent => Dom.element = "target"
@send external closest: (Dom.element, string) => option<Dom.element> = "closest"

let handleAddTask: string => unit = columnId => {
  switch querySelector(`#${columnId} .kanban__tasks`) {
  | Some(el) => Van.add(el, Task.create({id: randomUUID(), description: ""}))->ignore
  | None => Console.error(`The column with selector: #${columnId} .kanban__tasks does not exist.`)
  }
}

let handleDragOver: Dom.dragEvent => unit = event => {
  event->preventDefault
  switch event->getTargetMenu->closest(".kanban__tasks") {
  | Some(dropZone) =>
    Elym.select(Dom(dropZone))->Elym.classed("dropzone-active", ~exists=true)->ignore
  | None => Console.error("No drop zone found")
  }
}

let create: column => Dom.element = column =>
  Van.Dom.createElement("section")
  ->Van.Dom.setAttrs({"id": column.id, "class": "kanban__column"})
  ->Van.Dom.addChildren([
    Van.Dom.createElement("header")
    ->Van.Dom.setAttrs({"class": "kanban__title"})
    ->Van.Dom.addChild(
      Van.Dom.createElement("h2")
      ->Van.Dom.addChild(column.title->Van.Child.toText)
      ->Van.Dom.build
      ->Van.Child.toDom,
    )
    ->Van.Dom.addChild(
      if column.id == "todo" {
        Van.Dom.createElement("button")
        ->Van.Dom.setAttrs({
          "class": "kanban__add-task",
          "type": "button",
          "onclick": _ => handleAddTask(column.id),
        })
        ->Van.Dom.addChild("+ Add"->Van.Child.toText)
        ->Van.Dom.build
        ->Van.Child.toDom
      } else {
        Null->Van.Child.toNull
      },
    )
    ->Van.Dom.build
    ->Van.Child.toDom,
    Van.Dom.createElement("menu")
    ->Van.Dom.setAttrs({
      "class": "kanban__tasks",
      "ondragover": (event: Dom.dragEvent) => {
        event->preventDefault
        switch event->getTargetMenu->closest(".kanban__tasks") {
        | Some(dropZone) =>
          Elym.select(Dom(dropZone))->Elym.classed("dropzone-active", ~exists=true)->ignore
        | None => Console.error("No drop zone found")
        }
      },
    })
    ->Van.Dom.build
    ->Van.Child.toDom,
  ])
  ->Van.Dom.build
