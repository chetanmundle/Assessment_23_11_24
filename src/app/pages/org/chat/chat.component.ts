import { Component } from '@angular/core';
import { ChatBoatComponent } from "../../../shared/components/chat-boat/chat-boat.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatBoatComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

}
