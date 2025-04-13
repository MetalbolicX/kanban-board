@val @scope("document") @return(nullable)
external querySelector: string => option<Dom.element> = "querySelector"

let kanbanContainer = switch querySelector("#kanban-board") {
  | Some(el) => el
  | None => raise(Not_found)
}

Console.log(kanbanContainer)
