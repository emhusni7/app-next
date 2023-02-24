import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';


export default function NotifApp({children}){
  function createNotif(type, message, title){
      switch (type) {
        case 'info':
          return NotificationManager.info(message);
          break
        case 'success':
          return NotificationManager.success(message, title);
          break
        case 'warning':
          return NotificationManager.warning(message, title, 3000);
          break;
        case 'error':
          return NotificationManager.error(message, title, 1000);
          break;
      }
  }

  // modify props with parent
  const childrenWithProps = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a
    // typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { createNotif });
    }
    return child;
  });

  return (
    <div>
      {childrenWithProps}
      <NotificationContainer/>
    </div>
  );
    
}

/*
Calling Children as Props

const Child = ({ childName, sayHello }) => (
  <button onClick={() => sayHello(childName)}>{childName}</button>
);

function Parent({ children }) {
  function sayHello(childName) {
    console.log(`Hello from ${childName} the child`);
  }

  // `children` of this component must be a function
  // which returns the actual children. We can pass
  // it args to then pass into them as props (in this
  // case we pass `sayHello`).
  return <div>{children(sayHello)}</div>
}

function App() {
  // sayHello is the arg we passed in Parent, which
  // we now pass through to Child.
  return (
    <Parent>
      {(sayHello) => (
        <React.Fragment>
          <Child childName="Billy" sayHello={sayHello} />
          <Child childName="Bob" sayHello={sayHello} />
        </React.Fragment>
      )}
    </Parent>
  );
}
*/