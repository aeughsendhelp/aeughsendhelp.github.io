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

function BallisticsToTarget(cannon, target, power, directionBearing, length) {
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

        if(deltaTimes.length === 0) {
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
            console.log("The target is unreachable with your current cannon configuration!")
            // throw new OutOfRangeException("sdf");
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
        document.getElementById("pitchLimitNotif1").innerHTML = "Over 60°"
    } else if (pitch1 < -29.5) {
        document.getElementById("pitchLimitNotif1").innerHTML = "Under -30°"
    }

    if (pitch2 > 60.5) {
        document.getElementById("pitchLimitNotif2").innerHTML = "Over 60°"
    } else if (pitch2 < -29.5) {
        document.getElementById("pitchLimitNotif2").innerHTML = "Under -30°"
    }

    const airtimeSeconds1 = airtime1 / 20;
    const airtimeSeconds2 = airtime2 / 20;

    yaw = (yaw + directionBearing) % 360;

    // if (direction === "north") {
    //     yaw = (yaw + 90) % 360;
    // } else if (direction === "west") {
    //     yaw = (yaw + 180) % 360;
    // } else if (direction === "south") {
    //     yaw = (yaw + 270) % 360;
    // } else if (direction !== "east") {
    //     return "Invalid direction";
    // }

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



function Calculate() {
    document.getElementById('artilleryerror').innerHTML = ""
    document.getElementById("pitchLimitNotif1").innerHTML = ""
    document.getElementById("pitchLimitNotif2").innerHTML = ""

    // This sucks. I hate how I did this.
    // it works tho
    const cannonOffset = [Number(document.getElementById('cannonOffsetX').value), 
                        Number(document.getElementById('cannonOffsetY').value), 
                        Number(document.getElementById('cannonOffsetZ').value)];
    const chargeNumber = document.getElementById('chargeNumber').value;
    const cannonLength = document.getElementById('cannonLength').value;

    const initialCoords = [Number(document.getElementById('initialCoordsX').value), 
                        Number(document.getElementById('initialCoordsY').value), 
                        Number(document.getElementById('initialCoordsZ').value)];
    const initialMountBearing = document.getElementById('initialMountBearing').value;

    const targetCoords = [Number(document.getElementById('targetCoordsX').value), 
                        Number(document.getElementById('targetCoordsY').value), 
                        Number(document.getElementById('targetCoordsZ').value)];


    const cannonCoords = [initialCoords[0] + cannonOffset[0], 
                        initialCoords[1] + cannonOffset[1], 
                        initialCoords[2] + cannonOffset[2]];


    if(!cannonOffset || !chargeNumber || !cannonLength || !initialCoords || !initialMountBearing || !targetCoords) {
        document.getElementById('artilleryerror').innerHTML = "bro doesn't know how to enter a number 💀"
        return;
    }

    const result = BallisticsToTarget(cannonCoords, targetCoords, chargeNumber, initialMountBearing, cannonLength);
    console.log(result);

    // Output 1
    document.getElementById('pitch1').value = result[0].pitch;
    document.getElementById('globalYaw1').value = result[0].yaw + initialMountBearing;
    document.getElementById('localYaw1').value = result[0].yaw;
    document.getElementById('airtime1').value = result[0].airtime;
    document.getElementById('precision1').value = result[0].precision;

    // Output 2
    document.getElementById('pitch2').value = result[1].pitch;
    document.getElementById('globalYaw2').value = result[1].yaw + initialMountBearing;
    document.getElementById('localYaw2').value = result[1].yaw;
    document.getElementById('airtime2').value = result[1].airtime;
    document.getElementById('precision2').value = result[1].precision;
}