// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [hoursStudied, setHoursStudied] = useState('');
//   const [hoursSlept, setHoursSlept] = useState('');
//   const [stressLevel, setStressLevel] = useState('0.5');
//   const [result, setResult] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setResult(null);

//     const body = {
//       hours_studied: parseFloat(hoursStudied),
//       hours_slept: parseFloat(hoursSlept),
//       stress_level: parseFloat(stressLevel),
//     }

//     try {
//       const response = await axios.post('http://localhost:3001/predict', body);

//       setResult(response.data);
//     } catch (err) {
//       console.error('Prediction failed:', err);
//       alert('Something went wrong while predicting. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">Student Success Predictor</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 font-medium">Hours Studied</label>
//             <input
//               type="number"
//               className="w-full p-2 border rounded-lg"
//               value={hoursStudied}
//               onChange={(e) => setHoursStudied(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Hours Slept</label>
//             <input
//               type="number"
//               className="w-full p-2 border rounded-lg"
//               value={hoursSlept}
//               onChange={(e) => setHoursSlept(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Stress Level (0–1)</label>
//             <div className="flex items-center gap-4">
//               <input
//                 type="range"
//                 step="0.1"
//                 min="0"
//                 max="1"
//                 value={stressLevel}
//                 onChange={(e) => setStressLevel(e.target.value)}
//                 className="w-full"
//               />
//               <span className="text-sm font-medium text-gray-600">{stressLevel}</span>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
//           >
//             Predict
//           </button>
//         </form>

//         {result && (
//           <div className="mt-6 text-center">
//             <h2 className="text-xl font-semibold text-gray-700">
//               Prediction:{' '}
//               <span className={`font-bold ${result.prediction === 'Success' ? 'text-green-600' : 'text-red-600'}`}>
//                 {result.prediction}
//               </span>
//             </h2>
//             <p className="text-gray-500 mt-1">Confidence: {Math.round(result.probability * 100)}%</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [hoursStudied, setHoursStudied] = useState('');
  const [hoursSlept, setHoursSlept] = useState('');
  const [stressLevel, setStressLevel] = useState(0.5);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    try {
      const body = {
        hours_studied: parseFloat(hoursStudied),
        hours_slept: parseFloat(hoursSlept),
        stress_level: parseFloat(stressLevel),
      };

      const response = await axios.post('http://localhost:3001/predict/', body);
      setResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  // Transform influence data for the chart
  const chartData = result?.influential_factors
    ? Object.entries(result.influential_factors).map(([key, value]) => ({
        name: key.replace('_', ' '),
        influence: Number((value * 100).toFixed(2)),
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">Student Success Predictor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Hours Studied</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={hoursStudied}
              onChange={(e) => setHoursStudied(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Hours Slept</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={hoursSlept}
              onChange={(e) => setHoursSlept(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Stress Level (0–1)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                step="0.1"
                min="0"
                max="1"
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
                className="w-full"
              />
              <span className="text-sm font-medium text-gray-600">{stressLevel}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Predict
          </button>
        </form>

        {result && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Prediction:{' '}
              <span
                className={`font-bold ${
                  result.prediction === 'Success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {result.prediction}
              </span>
            </h2>
            <p className="text-gray-500 mt-1">
              Confidence: {Math.round(result.probability * 100)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Recommended Study Hours: {result.recommended_study_hours} hrs
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Model Output Score: {result.raw_output.toFixed(4)}
            </p>

            {chartData.length > 0 && (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Bar dataKey="influence" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;