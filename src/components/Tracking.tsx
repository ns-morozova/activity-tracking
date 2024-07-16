import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './Tracking.module.css';

interface IWorkout {
    date: string;
    distance: number;
}

export const Tracking: React.FC = () => {
    const [workouts, setWorkouts] = useState<IWorkout[]>([]);
    const [date, setDate] = useState<string>('');
    const [distance, setDistance] = useState<number | string>('');
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [tempDate, setTempDate] = useState<string>('');
    const [tempDistance, setTempDistance] = useState<number | string>('');

    const handleAddOrUpdateWorkout = () => {
        if (!date || distance === '') return;

        const parsedDistance = typeof distance === 'string' ? parseFloat(distance) : distance;
        if (editIndex !== null) {
            const updatedWorkouts = [...workouts];
            updatedWorkouts[editIndex] = { date, distance: parsedDistance };
            setWorkouts(updatedWorkouts);
            setEditIndex(null);
        } else {
            const existingWorkoutIndex = workouts.findIndex(workout => workout.date === date);
            if (existingWorkoutIndex !== -1) {
                const updatedWorkouts = [...workouts];
                updatedWorkouts[existingWorkoutIndex].distance += parsedDistance;
                setWorkouts(updatedWorkouts);
            } else {
                const newWorkouts = [...workouts, { date, distance: parsedDistance }];
                newWorkouts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setWorkouts(newWorkouts);
            }
        }
        setDate('');
        setDistance('');
    };

    const handleEditWorkout = (index: number) => {
        setTempDate(workouts[index].date);
        setTempDistance(workouts[index].distance);
        setEditIndex(index);
        setIsModalOpen(true);
    };

    const handleDeleteWorkout = (index: number) => {
        const updatedWorkouts = workouts.filter((_, i) => i !== index);
        setWorkouts(updatedWorkouts);
    };

    const handleSaveChanges = () => {
        if (editIndex !== null) {
            const parsedDistance = typeof tempDistance === 'string' ? parseFloat(tempDistance) : tempDistance;
            const updatedWorkouts = [...workouts];
            updatedWorkouts[editIndex] = { date: tempDate, distance: parsedDistance };
            setWorkouts(updatedWorkouts);
            setEditIndex(null);
            setIsModalOpen(false);
        }
    };

    const handleCancelChanges = () => {
        setEditIndex(null);
        setIsModalOpen(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>Трекер активности</h2>
                <div className={styles.inputRow}>
                    <div>
                        <label>Дата (ДД.ММ.ГГ)</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label>Пройдено км</label>
                        <input
                            type="number"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            step="0.1"
                            min="0"
                            className={styles.input}
                        />
                    </div>
                    <button className={styles.button} onClick={handleAddOrUpdateWorkout}>добавить</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Дата (ДД.ММ.ГГ)</th>
                            <th>Пройдено км</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.map((workout, index) => (
                            <tr key={index}>
                                <td>{formatDate(workout.date)}</td>
                                <td>{workout.distance}</td>
                                <td>
                                    <FaEdit onClick={() => handleEditWorkout(index)} />
                                    <FaTrash onClick={() => handleDeleteWorkout(index)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <>
                    <div className={styles.overlay}></div>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Редактировать тренировку</h2>
                            <div className={styles.inputRow}>
                                <div>
                                    <label>Дата (ДД.ММ.ГГ)</label>
                                    <input
                                        type="date"
                                        value={tempDate}
                                        onChange={(e) => setTempDate(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>
                                <div>
                                    <label>Пройдено км</label>
                                    <input
                                        type="number"
                                        value={tempDistance}
                                        onChange={(e) => setTempDistance(e.target.value)}
                                        step="0.1"
                                        min="0"
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.buttonModal} onClick={handleSaveChanges}>OK</button>
                                <button className={styles.buttonModal} onClick={handleCancelChanges}>ОТМЕНА</button>
                            </div>
                        </div>
                    </div>
                </>
                
            )}

        </div>
    );
};
