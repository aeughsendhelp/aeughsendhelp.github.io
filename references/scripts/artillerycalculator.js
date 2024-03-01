function myLinspace(start, end, num) {
    const answer = [start];
    const delta = (end - start) / num;
    for (let i = 0; i < num - 1; i++) {
        answer.push(answer[answer.length - 1] + delta);
    }
    answer.push(end);
    return answer;
}

function timeInAir(y0, y, Vy) {
    let t = 0;
    let t_below = 999999999;

    if (y0 <= y) {
        while (t < 100000) {
            y0 += Vy;
            Vy = 0.99 * Vy - 0.05;
            t++;

            if (y0 > y) {
                t_below = t - 1;
                break;
            }

            if (Vy < 0) {
                return [-1, -1];
            }
        }
    }

    while (t < 100000) {
        y0 += Vy;
        Vy = 0.99 * Vy - 0.05;
        t++;

        if (y0 <= y) {
            return [t_below, t];
        }
    }
    return [-1, -1];
}

function getFirstElement(array) {
    return array[0];
}

function getRoot(tab, sens) {
    if (sens === 1) {
        for (let i = 1; i < tab.length; i++) {
            if (tab[i - 1][0] < tab[i][0]) {
                return tab[i - 1];
            }
        }
        return tab[tab.length - 1];
    } else if (sens === -1) {
        for (let i = tab.length - 2; i >= 0; i--) {
            if (tab[i][0] > tab[i + 1][0]) {
                return tab[i + 1];
            }
        }
        return tab[0];
    } else {
        throw new Error("sens must be 1 or -1");
    }
}

function BallisticsToTarget(cannon, target, power, direction, length) {
    const [Dx, Dz] = [cannon[0] - target[0], cannon[2] - target[2]];
    const distance = Math.sqrt(Dx * Dx + Dz * Dz);
    const initialSpeed = power * 2;
    const nbOfIterations = 5;
    let yaw, pitch;

    if (Dx !== 0) {
        yaw = Math.atan(Dz / Dx) * 57.2957795131; // 180/pi
    } else {
        yaw = 90;
    }

    if (Dx >= 0) {
        yaw += 180;
    }

    function tryAllAngles(low, high, nbOfElements) {
        const deltaTimes = [];
        for (const triedPitch of myLinspace(low, high, nbOfElements)) {
            const triedPitchRad = triedPitch * Math.PI / 180;
            const Vw = Math.cos(triedPitchRad) * initialSpeed;
            const Vy = Math.sin(triedPitchRad) * initialSpeed;
            const xCoord_2d = length * Math.cos(triedPitchRad);
            let timeToTarget;
            try {
                timeToTarget = Math.abs(Math.log(1 - (distance - xCoord_2d) / (100 * Vw)) / (-0.010050335853501));
            } catch (error) {
                continue;
            }

            const yCoordOfEndBarrel = cannon[1] + Math.sin(triedPitchRad) * length;
            const [t_below, t_above] = timeInAir(yCoordOfEndBarrel, target[1], Vy);

            if (t_below < 0) continue;

            const deltaT = Math.min(Math.abs(timeToTarget - t_below), Math.abs(timeToTarget - t_above));
            deltaTimes.push([deltaT, triedPitch, deltaT + timeToTarget]);
        }

        if (deltaTimes.length === 0) {
            throw new OutOfRangeException("The target is unreachable with your current cannon configuration !");
        }

        const [[deltaTime1, pitch1, airtime1], [deltaTime2, pitch2, airtime2]] = [getRoot(deltaTimes, 1), getRoot(deltaTimes, -1)];
        return [[deltaTime1, pitch1, airtime1], [deltaTime2, pitch2, airtime2]];
    }

    function tryAllAnglesUnique(low, high, nbOfElements) {
        const deltaTimes = [];
        for (const triedPitch of myLinspace(low, high, nbOfElements)) {
            const triedPitchRad = triedPitch * Math.PI / 180;
            const Vw = Math.cos(triedPitchRad) * initialSpeed;
            const Vy = Math.sin(triedPitchRad) * initialSpeed;
            const xCoord_2d = length * Math.cos(triedPitchRad);
            let timeToTarget;
            try {
                timeToTarget = Math.abs(Math.log(1 - (distance - xCoord_2d) / (100 * Vw)) / (-0.010050335853501));
            } catch (error) {
                continue;
            }

            const yCoordOfEndBarrel = cannon[1] + Math.sin(triedPitchRad) * length;
            const [t_below, t_above] = timeInAir(yCoordOfEndBarrel, target[1], Vy);

            if (t_below < 0) continue;

            const deltaT = Math.min(Math.abs(timeToTarget - t_below), Math.abs(timeToTarget - t_above));
            deltaTimes.push([deltaT, triedPitch, deltaT + timeToTarget]);
        }

        if (deltaTimes.length === 0) {
            throw new OutOfRangeException("The target is unreachable with your current cannon configuration !");
        }

        const [deltaTime, pitch, airtime] = deltaTimes.sort((a, b) => a[0] - b[0])[0];
        return [deltaTime, pitch, airtime];
    }

    let [[deltaTime1, pitch1, airtime1], [deltaTime2, pitch2, airtime2]] = tryAllAngles(-30, 60, 91);

    for (let i = 0; i < nbOfIterations; i++) {
        [deltaTime1, pitch1, airtime1] = tryAllAnglesUnique(pitch1 - Math.pow(10, -i), pitch1 + Math.pow(10, -i), 21);
        [deltaTime2, pitch2, airtime2] = tryAllAnglesUnique(pitch2 - Math.pow(10, -i), pitch2 + Math.pow(10, -i), 21);
    }

    if (pitch1 > 60.5) {
        pitch1 = "Over 60";
    } else if (pitch1 < -29.5) {
        pitch1 = "Under -30";
    }

    if (pitch2 > 60.5) {
        pitch2 = "Over 60";
    } else if (pitch2 < -29.5) {
        pitch2 = "Under -30";
    }

    const airtimeSeconds1 = airtime1 / 20;
    const airtimeSeconds2 = airtime2 / 20;

    if (direction === "north") {
        yaw = (yaw + 90) % 360;
    } else if (direction === "west") {
        yaw = (yaw + 180) % 360;
    } else if (direction === "south") {
        yaw = (yaw + 270) % 360;
    } else if (direction !== "east") {
        return "Invalid direction";
    }

    const fuzeTime1 = Math.floor(airtime1 + (deltaTime1 / 2) - 10);
    const fuzeTime2 = Math.floor(airtime2 + (deltaTime2 / 2) - 10);

    const precision1 = Math.round((1 - deltaTime1 / airtime1) * 100);
    const precision2 = Math.round((1 - deltaTime2 / airtime2) * 100);

    return [{
        yaw,
        pitch: pitch1,
        airtime: airtime1,
        airtimeSeconds: parseFloat(airtimeSeconds1.toFixed(2)),
        fuzeTime: fuzeTime1,
        precision: precision1,
    }, {
        yaw,
        pitch: pitch2,
        airtime: airtime2,
        airtimeSeconds: parseFloat(airtimeSeconds2.toFixed(2)),
        fuzeTime: fuzeTime2,
        precision: precision2,
    }];
}



window.onload = OnWindowLoad;

function OnWindowLoad() {
}

function Calculate() {
    const cannon = [0, 10, 0];
    const target = [20, 5, 0];
    const power = 5;
    const direction = "east";
    const length = 5;

    const result = BallisticsToTarget(cannon, target, power, direction, length);
    console.log(result);

    // Output
    document.getElementById('localPitch').value = '-9999999999';
    document.getElementById('localYaw').value = '-9999999999';

    document.getElementById('globalPitch').value = result[0].pitch;
    document.getElementById('globalYaw').value = result[0].yaw;
    
    document.getElementById('airtime').value = result[0].airtime;
    document.getElementById('precision').value = result[0].precision;
}