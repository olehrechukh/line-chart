import Chart from "./Chart";
import { data } from "../data";
import "../styles/App.scss";

function App() {
  return (
    <div className="App">
      <Chart data={data} />
    </div>
  );
}

export default App;
