import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {interval, Subscription, takeWhile} from "rxjs";
import {Database, onValue, ref} from "@angular/fire/database";
import {Router} from "@angular/router";
import {AngularFireAuth, AngularFireAuthModule} from "@angular/fire/compat/auth";
import {PlantApiClient} from "../client/AIApiClient";
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {PlantModel} from "../client/PlantModel";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        NgIf, FormsModule
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  title = 'angular-raspberry';
  public chart: any;
  data = [,];

  humidityData = 0;
  temperatureData = 0;
  lightData = true;
  waterData = 0;
  plantData: PlantModel | null = null;
  plantName: string = ''; // Add this property to hold the plant name input value



  constructor( private database: Database, private router: Router) {
    this.getDataValues();
  }

  getDataValues() {
    const humidity = ref(this.database, 'Humidity');
    onValue(humidity, (snapshot) => {
      this.humidityData = snapshot.val();
      console.log("Humidity: " + this.humidityData)
    });

    const light = ref(this.database, 'Light_detected');
    onValue(light, (snapshot) => {
      this.lightData = snapshot.val();
      console.log("Light detected:  " + this.lightData)
    });

    const temperature = ref(this.database, 'Temp');
    onValue(temperature, (snapshot) => {
      this.temperatureData = snapshot.val();
      console.log("Temperature:  " + this.temperatureData)
    });

    const water = ref(this.database, 'Water_detected');
    onValue(water, (snapshot) => {
      this.waterData = snapshot.val();
      console.log("Water detected:  " + this.waterData)
    });
  }


  //npm install axios
  fetchPlantData(plantName: string) {
    PlantApiClient.getOneAsync(plantName).then(
      (data) => {
        this.plantData = data;
        console.log("Plant Data: ", this.plantData);
      },
      (error) => {
        console.error("Error fetching plant data: ", error);
      }
    );
  }


}
