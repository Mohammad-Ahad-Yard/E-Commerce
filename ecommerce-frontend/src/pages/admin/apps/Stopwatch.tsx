import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const Stopwatch = () => {

    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const formatTime = (timeInSeconds:number) => {
        const hours = String(Math.floor(timeInSeconds / 3600));
        const minutes = String(Math.floor((timeInSeconds % 3600) / 60));
        const seconds = String(timeInSeconds % 60);

        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }

    const resetHandler = () => {
        setTime(0);
        setIsRunning(false);
    }

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if(isRunning) {
            intervalId = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        }
    }, [isRunning]);

  return (
    <div className="adminContainer">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Stopwatch</h1>
        <section>
            <div className="stopwatch">
                <h2>{formatTime(time)}</h2>
                <button onClick={() => setIsRunning(prev => !prev)}>
                    { isRunning ? "Stop" : "Start" }
                </button>
                <button onClick={resetHandler}>Reset</button>
            </div>
        </section>
      </main>
    </div>
  )
}

export default Stopwatch;