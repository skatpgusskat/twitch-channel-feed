import { JsonNode, TextJsonNode, ElementJsonNode } from './JsonNode';

export default function toJsonNodeFromHTMLElement(node: Node): JsonNode {
  const jsonNode = convertToJsonNode(node);
  if (!jsonNode) {
    throw new Error('node must be parsable');
  }
  return jsonNode;
}

function convertChildrenNodes(element: Node): JsonNode[] {
  return mapChildrenNodes(element, (child) => {
    const childJsonNode = convertToJsonNode(child);
    return childJsonNode;
  }).filter(node => node) as JsonNode[];
}

function convertToJsonNode(node: Node): JsonNode | undefined {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      {
        const nextNodes = convertChildrenNodes(node);
        const elementNode = ElementJsonNode.create(node as HTMLElement, nextNodes);
        return elementNode;
      }
    case Node.TEXT_NODE:
      {
        const textNode = node as Text;
        const textJsonNode = new TextJsonNode(textNode.nodeType, textNode.wholeText);
        return textJsonNode;
      }
  }
}

function runRecursively(node: Node, func: (node: Node) => void) {
  func(node);
  forEachChildrenNodes(node, (child) => runRecursively(child, func));
}


function mapChildrenNodes<T>(node: Node, func: (node: Node) => T): T[] {
  const ret: T[] = [];
  // tslint:disable-next-line
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const child = node.childNodes[i];
    const result = func(child);
    ret.push(result);
  }
  return ret;
}

function forEachChildrenNodes(element: Node, func: (node: Node) => void) {
  // tslint:disable-next-line
  for (let i = 0; i < element.childNodes.length; i += 1) {
    const child = element.childNodes[i];
    func(child);
  }
}
