@val @scope("document") @return(nullable)
external querySelector: string => option<Dom.element> = "querySelector"

let kanbanContainer = switch querySelector("#kanban-board") {
| Some(el) => el
| None => Exn.raiseError("No such element was found")
}

let columns: array<Column.column> = [
  {id: "todo", title: "To Do"},
  {id: "in-progress", title: "In Progress"},
  {id: "done", title: "Done"},
]

Van.add(kanbanContainer, columns->Array.map(Column.create))->ignore
