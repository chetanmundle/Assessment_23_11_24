import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { RoleServiceService } from '../../../core/services/RoleService/role-service.service';
import { Subscription } from 'rxjs';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';

@Component({
  selector: 'app-chat-boat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-boat.component.html',
  styleUrls: ['./chat-boat.component.css'], // Correct styleUrls for better styling
})
export class ChatBoatComponent implements OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  loggedUser?: UserWithoutPassDto;
  private hubConnection!: signalR.HubConnection;
  messages: { user: string; text: string; isMe: boolean }[] = [];
  chatForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  // currentUser: string = ''; // Keep track of the current user

  constructor(private roleService: RoleServiceService) {
    const sub = this.roleService.loggedUser$.subscribe({
      next: (user) => {
        this.loggedUser = user;
      },
      error: (err) => {
        console.error('No User Logged In', err);
      },
    });
    this.subscriptions.add(sub);

    this.chatForm = new FormGroup({
      user: new FormControl(this.loggedUser?.name, Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // Initialize chat with db(SignalR)
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7035/chatHub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch((err) => console.error('Error connecting to SignalR:', err));

    this.hubConnection.on('ReceiveMessage', (user: string, text: string) => {
      const isMe = user === this.loggedUser?.name; // Mark messages sent by the current user
      this.messages.push({ user, text, isMe });
    });
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      // const user = this.chatForm.get('user')?.value;
      const message = this.chatForm.get('message')?.value;

      this.hubConnection
        .invoke('SendMessage', this.loggedUser?.name, message)
        .then(() => {
          this.chatForm.get('message')?.reset(); // Only reset the message input
        })
        .catch((err) => console.error('Error sending message:', err));
    }
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
