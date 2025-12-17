import { FC } from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    label?: string;
    className?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({
    currentStep,
    totalSteps,
    label,
    className
}) => {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className={`w-full ${className || ''}`}>
            {label && (
                <p className="text-sm text-gray-600 mb-2 text-center">
                    {label}
                </p>
            )}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-teal-600 to-emerald-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Step {currentStep}</span>
                <span>{percentage.toFixed(0)}%</span>
            </div>
        </div>
    );
};
