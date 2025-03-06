export default function TaipyGrid() {
    return (
        <div className="bg-black text-white min-h-screen p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg">
                        <span className="text-yellow-400">Scenarios made easy</span> with Taipy Studio.
                    </h3>
                    <p>A powerful VS Code extension that unlocks a convenient graphical editor.</p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg flex flex-col items-center">
                    <h3 className="font-bold text-lg">Tasks Scheduler.</h3>
                    <p>Get your methods invoked at a certain time or intervals.</p>
                    <div className="mt-4 w-24 h-24 flex items-center justify-center rounded-full border-4 border-red-500">
                        <span className="text-xl">09:16</span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg">Customize styles.</h3>
                    <p>Enjoy a variety of predefined themes or build your own.</p>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                        <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
                        <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-gray-800 rounded-full">Get started</button>
                </div>

                {/* Card 4 */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg">Multi-users.</h3>
                    <p>Each end-user has their own state enabling multi-user support.</p>
                    <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                        <p><span className="text-blue-400">User 1</span> - Active</p>
                        <p><span className="text-red-400">User 2</span> - Idle</p>
                    </div>
                </div>

                {/* Card 5 */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg flex flex-col items-center">
                    <h3 className="font-bold text-lg">Long jobs.</h3>
                    <p>Run heavy tasks in the background without slowing down experience.</p>
                    <button className="mt-4 px-4 py-2 bg-red-500 rounded-full">Run the task</button>
                </div>

                {/* Card 6 */}
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg">Explore datasets with TalkToTaipy.</h3>
                    <p>Leverage LLM-based application to explore datasets using natural language.</p>
                    <input
                        type="text"
                        placeholder="plot sales by product in chart"
                        className="mt-3 p-2 bg-gray-700 rounded-lg w-full"
                    />
                </div>
            </div>
        </div>
    );
}