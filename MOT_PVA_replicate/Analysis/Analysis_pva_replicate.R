library(rjson)
library(tidyverse)

setwd("/Users/young/Desktop/UCSD/Research/MOT_code:data/MOT_PVA_replicate/Data")

#data transformation
all.data_pva = list()
subject = 1
for(file.name in list.files(pattern = '*.json')) {
  json_file = fromJSON(file = file.name)
  json_file[['subject']] = subject
  all.data_pva[[subject]] = json_file
  subject = subject + 1
}

num.subj = length(all.data_pva)
#extract the target selected for 3 conditions from all the participants
dat.accuracy_pva = data.frame()
for(i in 1:num.subj) {
  #trial number of each participant is 45.
  for(j in 1:48) {
    dat.accuracy_pva = rbind(dat.accuracy_pva,
                          data.frame(subject = all.data_pva[[i]]$subject,
                                     trial_number = all.data_pva[[i]]$trials[[j]]$trialNumber,
                                     trial_type = all.data_pva[[i]]$trials[[j]]$trialType,
                                     target_1 = all.data_pva[[i]]$trials[[j]]$selected_targets[1],
                                     target_2 = all.data_pva[[i]]$trials[[j]]$selected_targets[3],
                                     target_3 = all.data_pva[[i]]$trials[[j]]$selected_targets[5],
                                     target_4 = all.data_pva[[i]]$trials[[j]]$selected_targets[7]))
  }
}

#compute the accuracy rate for each trial (out of 4 pairs)
dat.accuracy_pva = dat.accuracy_pva %>% rowwise() %>% mutate(accuracy = (target_1 + target_2 + target_3 + target_4)/4) %>% ungroup()

summary_accuracy_pva = dat.accuracy_pva %>% group_by(subject,trial_type) %>% 
  summarise(mean = mean(accuracy)) %>% ungroup()

#plot (scatter plot)
#Change the trial_type to factors with labels.
summary_accuracy_pva$trial_type<- factor(summary_accuracy_pva$trial_type,labels = c("position", "velocity", "acceleration","positionOnly"))

#plot accuracy (x=subjects)
summary_accuracy_pva %>% ggplot(aes(x=subject, y=mean, color = trial_type)) +
  geom_point() + 
  facet_grid(trial_type~.)+  
  geom_hline(yintercept = c(0.5,0.5,0.5),color="orange",linetype = "dashed",size=1)+
  theme_bw()+
  ylim(0,1)+
  theme(panel.grid = element_blank())+
  labs(color = "Trial type", y = "accuracy")


#Overall accuracy of three types (mean and sd)
overall_summary_accuracy_pva = summary_accuracy_pva %>% group_by(trial_type) %>% summarise(N=n(),mean_overall = mean(mean),
                                                                                   sd_overall = sd(mean))

#Plot of overall accuracy
overall_summary_accuracy_pva %>% ggplot(aes(x = trial_type, y = mean_overall, fill = trial_type, group = 1)) + geom_bar(stat = "identity")+geom_point(size = 2) +
  # labs(x="Trial types", y = "Accuracy", title = "Tracking accuracy for position, velocity and acceleration conditions") + 
  geom_errorbar(aes(ymin = mean_overall - sd_overall/sqrt(N), ymax = mean_overall + sd_overall/sqrt(N)),
                width = 0.1) +
  ylim(0,1)+
  scale_y_continuous(breaks = seq(0,1,0.1))+
  theme_bw() +
  theme(panel.grid = element_blank(),
        axis.ticks.x = element_blank(),
        legend.position = "none",
        axis.text = element_text(size = 12),
        axis.text.x = element_blank(),
        axis.title = element_blank())+
  geom_hline(yintercept = 0.5,color="darkblue",linetype = "dashed",size=1)
  
  

#Hypothesis testing
accuracy_p = summary_accuracy_pva %>% filter(trial_type == "position") %>% pull(mean)
accuracy_v = summary_accuracy_pva %>% filter(trial_type == "velocity") %>% pull(mean)
accuracy_a = summary_accuracy_pva %>% filter(trial_type == "acceleration") %>% pull(mean)
accuracy_p_only = summary_accuracy_pva %>% filter(trial_type == "positionOnly") %>% pull(mean)

accuracy_p %>% t.test(mu = 0.5)
accuracy_v %>% t.test(mu = 0.5)
accuracy_a %>% t.test(mu =0.5)
accuracy_p_only %>% t.test(mu = 0.5)

t.test(accuracy_p,accuracy_v, paired = T, var.equal = F)
t.test(accuracy_p,accuracy_p_only, paired = T, var.equal = F)
