import scrollOnChange from "../../js/animations/inputEl";

describe("scrolls on any change in the childs of the element to the end", () => {
  beforeEach(() => {
    Element.prototype.scrollTo = jest.fn(() => "scrolled");
  });

  it("should create a MutationObserver and observe the element", () => {
    const mockObserver = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    const originalMutationObserver = global.MutationObserver;

    global.MutationObserver = jest.fn(() => mockObserver);

    const element = document.createElement("div");
    scrollOnChange(element);
    expect(global.MutationObserver).toHaveBeenCalledWith(expect.any(Function));
    expect(mockObserver.observe).toHaveBeenCalledWith(element, {
      childList: true,
    });

    jest.resetAllMocks();
    global.MutationObserver = originalMutationObserver;
  });

  it("should call scrollTo when a child is added", () => {
    const element = document.createElement("div");
    scrollOnChange(element); // add the observer
    const child = document.createElement("span");
    child.innerText = "hello, world";
    element.appendChild(child);
    // make jest wait for the observer to asynchronously call the element.scrollTo then run the expect funtion
    return Promise.resolve().then(() => {
      expect(element.scrollTo).toHaveBeenCalled();
    });
  });

  it("should call scrollTo when text is added", () => {
    const element = document.createElement("div");
    scrollOnChange(element);
    const textNode = document.createTextNode("text");
    element.appendChild(textNode);
    return Promise.resolve().then(() => {
      expect(element.scrollTo).toHaveBeenCalled();
    });
  });

  it("shouldn't call scrollTo when no child is added", () => {
    const element = document.createElement("div");
    scrollOnChange(element);
    return Promise.resolve().then(() => {
      expect(element.scrollTo).not.toHaveBeenCalled();
    });
  });
});
