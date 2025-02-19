import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const DRPredictionCard = ({ predictions }) => {
    //   const predictions = {
    //     "Mild": 23.34117591381073,
    //     "Moderate": 23.953722417354584,
    //     "No DR": 17.611809074878693,
    //     "Proliferative DR": 19.972501695156097,
    //     "Severe": 15.120790898799896
    //   };

    // const predictions = predictions["Diabetic Retinopathy"]

    const data = Object.entries(predictions).map(([key, value]) => ({
        name: key,
        value: parseFloat(value.toFixed(2))
    }));

    const getHighestPrediction = () => {
        const maxPrediction = Math.max(...Object.values(predictions));
        return Object.entries(predictions).find(([_, value]) => value === maxPrediction);
    };

    const [topClass, topScore] = getHighestPrediction();

    return (
        <div className="p-6 border rounded-lg shadow-sm bg-white w-full">
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Diabetic Retinopathy Prediction</h3>
                    <p className="text-sm text-gray-600 mt-1">Probability Distribution</p>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                label={{
                                    value: 'Probability (%)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' }
                                }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'Probability']}
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                            />
                            <Bar dataKey="value" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Highest Probability</p>
                        <p className="text-xl font-semibold text-gray-800 mt-1">
                            {topClass}
                        </p>
                        <p className="text-lg text-gray-700 mt-1">
                            {topScore.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};