type task = {
  id: string,
  description?: string,
}

@get external getDragTarget: Dom.dragEvent => Dom.element = "target"
@send external closest: (Dom.element, string) => option<Dom.element> = "closest"
@get external getEventTarget: Dom.event => Dom.element = "target"

let create: task => Dom.element = task =>
  Van.Dom.createElement("li")
  ->Van.Dom.setAttrs({
    "class": "kanban__task",
    "draggable": true,
    "data-id": task.id,
    "ondragstart": (event: Dom.dragEvent) => {
      let task = event->getDragTarget
      Elym.select(Dom(task))->Elym.classed("dragging", ~exists=true)->ignore
    },
    "ondragend": (event: Dom.dragEvent) => {
      let task = event->getDragTarget
      Elym.select(Dom(task))->Elym.classed("dragging", ~exists=false)->ignore
      Elym.selectAll(".kanban__tasks")
      ->Elym.each((el, _) => {
        Elym.select(Dom(el))->Elym.classed("dropzone-active", ~exists=false)->ignore
      })
      ->ignore
    },
  })
  ->Van.Dom.addChildren([
    Van.Dom.createElement("textarea")
    ->Van.Dom.setAttrs({
      "class": "kanban__task-description",
      "autocorrect": true,
      "spellcheck": true,
      "value": task.description,
      "onblur": (event: Dom.event) => {
        let textarea = event->getEventTarget
        switch (textarea->closest(".kanban__task"), textarea->closest(".kanban__column")) {
        | (Some(task), Some(column)) => {
            let (_, taskId) = Elym.select(Dom(task))->Elym.attr("data-id")
            let (_, columnId) = Elym.select(Dom(column))->Elym.attr("id")
            Console.log2(taskId, columnId)
          }
        | _ => Console.error("Task or column not found")
        }
      },
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
        "onclick": (event: Dom.event) => {
          switch event->getEventTarget->closest(".kanban__task") {
          | Some(task) => Elym.select(Dom(task))->Elym.remove
          | None => Console.error("Task not found")
          }
        },
      })
      ->Van.Dom.addChild("🗑"->Van.Child.toText)
      ->Van.Dom.build
      ->Van.Child.toDom,
    )
    ->Van.Dom.build
    ->Van.Child.toDom,
  ])
  ->Van.Dom.build
